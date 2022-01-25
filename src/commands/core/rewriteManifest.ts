import { readFile, writeFile } from "fs/promises";
import * as vscode from 'vscode';
import * as path from 'path';

const manifestPath = getManifestPath();

export async function rewriteManifest(params: {
  targetDirName: string
}) {
  const { targetDirName } = params;
  const manifestStr = await getManifestContent();
  try {
    const manifestObj = JSON.parse(manifestStr);
    const oldPages = manifestObj.pages;
    const newPages = [...oldPages, `pages/${targetDirName}/index`];
    manifestObj.pages = newPages;
  
    try {
      const formateStr = JSON.stringify(manifestObj, null, 2);
      writeFile(manifestPath, formateStr);
    } catch (error) {
      vscode.window.showErrorMessage("写入manifest.json文件失败");
    }
  } catch (error) {
    vscode.window.showErrorMessage("manifest.json文件json格式错误");
  }
}

async function getManifestContent():Promise<string> {
  let result: string = '';
  if(manifestPath) {
    try {
      let res = await readFile(manifestPath);
      result = res.toString();
    } catch (error) {
      vscode.window.showErrorMessage('读取manifest文件出错,请检查是否存在manifest.json文件');
    }
  } else {
    vscode.window.showErrorMessage('不支持多workspace');
  }
  return result;
}


function getManifestPath():string {
  let url :string= '';
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1){
    return url = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '/manifest.json');
  } 
  return url;
}
