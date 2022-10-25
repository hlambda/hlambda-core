import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

import { connections } from './registerConnectCommands';

const reloadServerCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension}|reloadServerCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// We want to find the active file in editor, resolve the folder and then we execute. If we can't find the folder from active editor we ask.
	console.log('folders', vscode.workspace.workspaceFolders);
	// const folders = vscode.workspace.workspaceFolders?.map((item) => item.name) ?? [];

	const connectionsUrls = connections.map((item) => item.baseUrl) || [];

	// We need at least one connection
	if (connectionsUrls.length > 0) {
		const selectedConnectionUrl = await vscode.window.showQuickPick(connectionsUrls, {
			placeHolder: 'Select Hasura Server you want to issue the command!',
		});

		console.log('selectedConnectionUrl', selectedConnectionUrl);
		// We need to find the connection with that name.
		const conn = connections.find((o) => {
			return o.baseUrl === selectedConnectionUrl;
		});

		vscode.window.showInformationMessage(
			`[${instanceOfExtension}|reloadServerCommand]\nSuccess!\n<${commandExecutionInstance}>\n\n${'res'}`
		);
	}
};

export const registerReloadServerCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.reloadServerCommand', reloadServerCommand));
};

export default registerReloadServerCommands;
