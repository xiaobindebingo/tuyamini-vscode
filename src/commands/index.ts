import * as vscode from 'vscode';
import { TemplateType } from './constants';
import { generatorTemplateDir } from './core/generatorTemplateDir';
import { rewriteManifest } from './core/rewriteManifest';
export const createComponentCommand = vscode.commands.registerCommand("createComponentDir", async (uri:vscode.Uri, ...args) => {
  const dirPath = uri.fsPath;
  const input = await vscode.window.showInputBox({
    prompt: "请输入组件名称",
    validateInput: (s: string): string | undefined => s && s.trim() ? undefined : "Component name must not be empty.",
    placeHolder: "Example: avatar (will create 4 files, default is avatar.css avatar.json avatar.js avatar.xml)",
    ignoreFocusOut: true,
  });

  input && generatorTemplateDir({
    dirPath,
    targetDirName: input,
    templateType: TemplateType.component
  });

});

export const createPageCommand = vscode.commands.registerCommand("createPageDir", async (uri:vscode.Uri, ...args) => {
  const dirPath = uri.fsPath;
  const input = await vscode.window.showInputBox({
    prompt: "请输入页面名称",
    validateInput: (s: string): string | undefined => s && s.trim() ? undefined : "Page name must not be empty.",
    placeHolder: "Example: Index (will create 4 files, default is Index.css Index.json Index.js Index.xml)",
    ignoreFocusOut: true,
  });


  input && generatorTemplateDir({
    dirPath,
    targetDirName: input,
    templateType: TemplateType.page,
  });

  // TODO ： 重写 Manifest 文件，就会重写全部，这样git记录如何记录
  input && rewriteManifest(
    {targetDirName: input as string}
  );
});



