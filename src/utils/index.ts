import { Position, Range, TextDocument } from "vscode";
import { IComponent } from "../config/componentDataConfig";

function list(title: string, items?: string[]) {
  if (!items || !items.length) { return []; };
  if (items.length === 1) { return [field(title, items[0])]; };
  return [field(title, items?.map(it => `\n* ${it}`).join(''))];
}

function since(val: string) {
  return field('Since', link(val, 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'));
}

function link(name: string, url: string) {
  return `[${name}](${url})`;
}

function field(title: string, value: string) {
  return `**${title}:** ${value}`;
}

function _formatAttrValue(av: { value: string; desc?: string; since?: string }) {
  const rows = [av.value];
  if (av.desc) { rows.push(`**${av.desc}**`); };
  if (av.since) { rows.push(since(av.since)); };
  if (rows.length > 1) { rows[0] += ':'; };
  return rows.join(' ');
}


export function getComponentMarkdown(c: IComponent) {
  const rows: string[] = c.desc ? [...c.desc] : [c.name];

  if (c.since) { rows.push(since(c.since)); };
  if (c.authorize) { rows.push(field('需要授权', link(c.authorize.name, c.authorize.link))); };

  rows.push(...list('Bug', c.bugs));
  rows.push(...list('Tip', c.tips));
  rows.push(...list('Note', c.notices));

  if (c.relateApis) { rows.push(...list('API Interface', c.relateApis?.map(l => link(l.name, l.link)))); };
  if (c.docLink) { rows.push(link('TUYA MINI DOC Reference', c.docLink)); };

  return rows.join('\n\n');
}

export function getCloseTag(text: string, excludedTags: string[] = []): string {
  // 过滤变量和值中`<``>`
  text = text.replace(/"[^"]*"|'[^']*'|\{\{[^\}]*?\}\}/g, '');
  // const regex = /<(\/?[\w\d-]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?>/g
  const regex = /<(\/?[\w\d-]+)[^<>]*\s?>/g; // 简化正则提高性能
  let result = null;
  const stack = [];
  // tslint:disable-next-line: no-conditional-assignment<
  while ((result = regex.exec(text))) {
    if (!result[1] || result[0].endsWith('/>')) {
      // 自闭标签
      continue;
    }
    const isStartTag = result[1].substr(0, 1) !== '/';
    const tag = isStartTag ? result[1] : result[1].substr(1);
    if (!excludedTags.includes(tag.toLowerCase())) {
      if (isStartTag) {
        stack.push(tag);
      } else if (stack.length > 0) {
        const lastTag = stack[stack.length - 1];
        if (lastTag === tag) {
          stack.pop();
        }
      }
    }
  }
  if (stack.length > 0) {
    const closeTag = stack[stack.length - 1];
    if (text.substr(text.length - 2) === '</') {
      return closeTag + '>';
    }
    if (text.substr(text.length - 1) === '<') {
      return '/' + closeTag + '>';
    }
    return '</' + closeTag + '>';
  } else {
    return '';
  }
}

interface Tag {
  /** Tag 的名称 */
  name: string
  /** 光标位置是否是在 tag name 上 */
  isOnTagName: boolean
  /** 光标位置是否是在 tag attr name 上 */
  isOnAttrName: boolean
  /** 只有 isOnAttrName 为 true 时才有效 */
  attrName: string
  /** 光标位置是否是在 tag attr value 上 */
  isOnAttrValue: boolean
  /** 光标所在位置上的单词是什么 */
  posWord: string
  attrs: {
    [key: string]: string | boolean
  }
}

/**
 * 
 * @param text 
 * @param offset 
 * @returns [标签左括号的起始位置，到右标签的长度]
 */
function getBracketRange(text: string, offset: number): [number, number] | null {
  const textBefore = text.substr(0, offset);
  const startBracketIndex = textBefore.lastIndexOf('<');
  const endBracketIndex = text.indexOf('>', offset + 1);
  if (startBracketIndex < 0 ||
    textBefore[startBracketIndex + 1] === '!' ||
    textBefore.lastIndexOf('>') > startBracketIndex) {
    return null;
  }

 return [startBracketIndex, endBracketIndex - startBracketIndex];
}

export function getXMLTag(document: TextDocument, position: Position): null | Tag {
  let offset = document.offsetAt(position);
  let text = document.getText();

  let pureText = text.replace(/\{\{[^\}]*?\}\}/g, (value) => {
    return '^'.repeat(value.length);
  });
  let attrFlagText = pureText.replace(/"[^"]*"|['][^']*'/g, (value) => {
    return '%'.repeat(value.length);
  });

  const range = getBracketRange(attrFlagText, offset);
  if (range) {
    const tagStr = text.substr(range[0], range[1]);
    const tagNameMatch = tagStr.match(/^<([\w-:.]+)/);
    let posWord='', tagName = '', isOnTagName = false, isOnAttrName = false,  isOnAttrValue = false, attrs = {}, attrName = '';
    if (tagNameMatch) {
      tagName = tagNameMatch[1];
      const attrsStr = text.substr(range[0], range[1]).substr(tagNameMatch[0].length);
      isOnTagName = offset - range[0] < tagName.length + 1;
      isOnAttrValue = attrFlagText[offset] === '%';
      isOnAttrName = !isOnTagName && !isOnAttrValue;
      posWord =  document.getText(document.getWordRangeAtPosition(position, /\b[\w:.]+\b/));
      const initial: any = {};
      attrs = attrsStr.split(' ').filter(item => item.trim()!=='').reduce((prev,item) => {
        const [name, value ] = item.split('=');
        if (name !== undefined && value !==undefined) {
          prev[name] = value;
        }
        return prev;
      }, initial);
      if (isOnAttrValue) {
         const matchArr: any = attrsStr.substr(0, offset - range[0]).match(/\s*([\w:-.]+)=[%]*/);
         attrName = matchArr[1];
      }
      }
      return {
        name: tagName,
        isOnTagName,
        isOnAttrName,
        isOnAttrValue,
        posWord,
        attrName,
        attrs,
      };
    }
    return null;
  }



