import * as vscode from 'vscode';
import { removeComponent } from './commands/Removal';

export const EXTENSION_LOG_NAME = "[SPFx remove]";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('estruyf.removespfxcomponent', removeComponent);
	
	context.subscriptions.push(disposable);

	console.log(`${EXTENSION_LOG_NAME}: is now active!`);
}

export function deactivate() {}