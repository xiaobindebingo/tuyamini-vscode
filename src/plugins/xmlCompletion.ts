
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  MarkdownString,
  Position,
  ProviderResult,
  Range,
  SnippetString,
  TextDocument,
} from 'vscode';
import { selfCloseTag } from '../config/closeTag';
import componentDataConfig, { IComponent } from '../config/componentDataConfig/';
import xmlSnippets from '../snippets/xmlSnippets'; 
import { getCloseTag, getComponentMarkdown, getXMLTag } from '../utils';
import { EOL } from 'os';
class XMLCompletion implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const triggerChar = this.getInputChar(document, position);
    switch (triggerChar) {
      case '<':
        // 标签自动补全 + 复杂标签snippets自动补全 done
        return this.createSnippetsAndTag(document, position);
      case ' ':
        // 如果后面紧跟字母数字或_不触发自动提示， 否则自动提示属性 done
        const afterChar = document.getText(new Range(position, new Position(position.line, position.character + 1)));
        if (/[\w_\d]/g.test(afterChar)) {
          return new Promise((resolve,reject) => {
            resolve([]);
          });
        }
        break;
      case ':':
        // TODO 绑定变量 （也可以是原生小程序的控制语句或事件，如 ty:for, bind:tap）
        return this.createSpecialAttributeItems(document, position);
      case '"':
      case "'":
        // 标签的属性和值补全
        return this.createAttrAttibuteItems(document, position);
        break;
      case "/":
        // 闭合标签自动补全 done
        return this.autoCloseTag(document, position);
        break;
      default:
        if(triggerChar > 'a' && triggerChar < 'z') {
          // TODO 标签的属性和值补全
          return this.createAttrAttibuteItems(document, position);
        }
        break;
    }
  }

  get attrQuote(): string {
    return '"';
  }

  createSnippetsAndTag(document: TextDocument, position: Position) :ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const tagAutoComplete: ProviderResult<CompletionItem[] | CompletionList<CompletionItem>>  = componentDataConfig?.map(item => {
      const insertText = this.insertText(item);
      return {
        label: item.name,
        insertText,
        documentation: new MarkdownString(getComponentMarkdown(item)),
        kind: CompletionItemKind.Keyword,
        sortText: 'c',
      };
    });
    const snipptesAutoComplete: ProviderResult<CompletionItem[] | CompletionList<CompletionItem>>  = 
   Object.keys(xmlSnippets)?.map((key: string) => {
      const item = new CompletionItem(`${key}  snippets`,CompletionItemKind.Snippet);
      let body = Array.isArray(xmlSnippets[key].body) ? xmlSnippets[key].body.join(EOL) : xmlSnippets[key].body;
      body = body.replace(/___/g, this.attrQuote);
      if (body.startsWith('<')) {
        body = body.slice(1);
      }
      item.insertText = new SnippetString(body);
      item.sortText = "a";
      return item;
    });
    return [
      ...snipptesAutoComplete,
      ...tagAutoComplete,
    ];

  }

  createSpecialAttributeItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    // TODO 
    return [];
  }
  createAttrAttibuteItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    // 是否在 标签上，在属性值上并且有属性名
    //  1. 如果属性名是class
    // 2. 是否以bind: catch 开头
    // 3. 如果输入空格 attrValue.trim() ==''时； 补全所有属性
    // 4. 
    const tag = getXMLTag(document, position);

    return [];
  }

  autoCloseTag(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const start = new Position(0, 0);
    const text = document.getText(new Range(start, position));
    const closeTag = getCloseTag(text);
    if (closeTag) {
      const completionItem = new CompletionItem(closeTag)
      completionItem.kind = CompletionItemKind.Property
      completionItem.insertText = closeTag

      const nextPos = new Position(position.line, position.character + 1)
      if (document.getText(new Range(new Position(position.line, position.character - 1), position)) === '>') {
        completionItem.range = new Range(position, nextPos);
        completionItem.label = closeTag.substr(0, closeTag.length - 1);
      }
      return [completionItem];
    }
    return [];
  }

  /**
   * 
   * @param document 
   * @param position 
   * @returns 当前文档输入最后的一个字符
   * @description 获取文档输入最后的一个字符
   */
  getInputChar(document: TextDocument, position: Position): string {
    const start = new Position(position.line, position.character - 1);
    const charRange = new Range(start, position);
    return document.getText(charRange);
  }
  
  insertText(tagData: IComponent) :SnippetString{
    const { name: tagName, attrs } = tagData;
    let autoStr = '';
    const autoCompleteAttrs = attrs?.filter(attr => attr.required)?.map((attr, index) => {
      const { name, defaultValue } = attr || {};
      const { attrQuote } = this;
      return `${name}=${attrQuote}${this.getDefaultValue(index + 1, defaultValue)}${attrQuote}`;
    }) || [];
    if (selfCloseTag.includes(tagName)) {
      // 自闭合标签
       autoStr = `${tagName} ${autoCompleteAttrs.join(' ')}/>\${0}`;
     } else {
 
       autoStr = `${tagName}${autoCompleteAttrs.length ?' ': ''}${autoCompleteAttrs.join(' ')}>\${0}</${tagName}>`;
     }
    

    

    return new SnippetString(autoStr);
  }

  private getDefaultValue(index: number, defaultValue: any) {
    if (!this.isDefaultValueValid(defaultValue)) {return '${' + index + '}';};
    if (typeof defaultValue === 'boolean' || defaultValue === 'true' || defaultValue === 'false') {
      return `{{\${${index}|true,false|}}}`;
    } else {
      return `\${${index}:${String(defaultValue).replace(/['"]/g, '')}}`;
    }
  }

  private isDefaultValueValid(defaultValue: any) {
    return defaultValue !== undefined && defaultValue !== '';
  }

}

export default new XMLCompletion();