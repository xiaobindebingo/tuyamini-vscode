

/* 
 1. fs.stat  检测是文件还是目录(目录 文件是否存在) 
 2. fs.mkdir  创建目录 （创建之前先判断是否存在） 
 3. fs.writeFile  写入文件(文件不存在就创建,但不能创建目录) 
 4. fs.appendFile 写入追加文件 
 5.fs.readFile 读取文件 
 6.fs.readdir 读取目录 
 7.fs.rename 重命名 
 8. fs.mdir  删除目录 
 9. fs.unlink 删除文件 
*/


import { readdir, mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { compile } from 'ejs';

import { componentJSContent } from '../../assets/Component/component_js';
import { componentCssContent } from '../../assets/Component/component_css';
import { componentJsonContent } from '../../assets/Component/component_json';
import { componentXMLContent } from '../../assets/Component/component_xml';
import { pageJSContent } from '../../assets/Page/page_js';
import { pageCssContent } from '../../assets/Page/page_css';
import { pageXMLContent } from '../../assets/Page/page_xml';
import { pageJsonContent } from '../../assets/Page/page_json';
import { TemplateType } from '../constants';
import { readFile } from 'fs/promises';


const pageConfig = [
  {
    extname: 'js',
    content: pageJSContent,
  },
  {
    extname: 'css',
    content: pageCssContent,
  },
  {
    extname: 'xml',
    content: pageXMLContent,
  },
  {
    extname: 'json',
    content: pageJsonContent,
  }
];


const componentConfig = [
  {
    extname: 'js',
    content: componentJSContent,
    page: pageJSContent
  },
  {
    extname: 'css',
    content: componentCssContent,
    page: pageCssContent,
  },
  {
    extname: 'xml',
    content: componentXMLContent,
    page: pageXMLContent
  },
  {
    extname: 'json',
    content: componentJsonContent,
    page:pageJsonContent
  }
];

/**
 * @description  ejs 渲染后的模版
 * @returns 最终模版渲染字符串
 * @pa
 * 
 */

function getTemplateContent(params: {
  dirPath: string;
  targetDirName: string|undefined;
  extName: string,
  content: string
}) {
  const {dirPath, targetDirName, extName, content } = params;
  const dirName = dirPath.split('/').slice(-1);
  // <%= dir %>/ <%=fileName %>.<%=extName %>
 return compile(content)({
    dir: dirName,
    fileName: targetDirName,
    extName
  });
}

/**
 * @description 在 dirPath 下生成文件夹
 * @param dirPath 在该目录下生成文件夹
 * @returns 
 */

export async function generatorTemplateDir (params: {
  dirPath: string;
  targetDirName: string|undefined;
  templateType: TemplateType
}) {
  const {dirPath, targetDirName, templateType } = params;
  try {
    await mkdir(path.join(dirPath, targetDirName as string));
  } catch (error) {
      vscode.window.showErrorMessage('创建组件目录失败');
  }
  const config = templateType === TemplateType.component ? componentConfig : pageConfig;
  // 生成路径，写入文件内容
  const filePromises = config.map(async (item) => {
    // 
    const contentTransfer =  getTemplateContent({
      dirPath,
      targetDirName,
      extName: item.extname,
      content: item.content,
    });

    const filePath = path.join(dirPath, targetDirName as string, `index.${item.extname}`);
    return writeFile(filePath, contentTransfer);
  });
  Promise.all(filePromises).then(() => {
    vscode.window.showInformationMessage(`创建${targetDirName}成功`);
  }).catch(e => {
    vscode.window.showErrorMessage(`创建${targetDirName}失败，${e}`);
    console.log(e);
  });
}



/**
 * 
 */
