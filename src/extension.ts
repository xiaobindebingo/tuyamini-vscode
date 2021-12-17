// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';
import { createComponentCommand, createPageCommand } from './commands';
const { workspace, languages } = vscode;
import XMLCompletionIns from './plugins/xmlCompletion';

function autoConfig() {
	const c = workspace.getConfiguration()
	const test = 	c.get('emmet.includeLanguages');
	const updates: { key: string; map: any }[] = [
		{
			key: 'files.associations',
			map: {
				'*.sjs': 'javascript',
			},
		},
		{
			key: 'emmet.includeLanguages',
			map: {
				"xml": "html",
				"html": "xml",
			},
		},
	];

	updates.forEach(({ key, map }) => {
		const oldMap = c.get(key, {}) as any;
		const appendMap: any = {};
		Object.keys(map).forEach(k => {
			appendMap[k] = map[k];
			// if (!oldMap.hasOwnProperty(k)) appendMap[k] = map[k]
		});
		if (Object.keys(appendMap).length) {
			c.update(key, { ...oldMap, ...appendMap }, true);
		}
	});
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createComponentCommand, createPageCommand)
	console.log('Congratulations, your extension "Tuya miniapp" is now active!');
	autoConfig();
	languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'xml' },
		XMLCompletionIns,
		'<',
		' ',
		':',
		'-',
		'"',
		"'",
		'/');
}

// this method is called when your extension is deactivated
export function deactivate() { }
