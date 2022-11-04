import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';
import { connections } from './registerConnectCommands';

const getEnvironmentsCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension} - getEnvironmentsCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// We want to find the active file in editor, resolve the folder and then we execute. If we can't find the folder from active editor we ask.
	console.log('folders', vscode.workspace.workspaceFolders);
	// const folders = vscode.workspace.workspaceFolders?.map((item) => item.name) ?? [];

	const connectionsUrls = connections.map((item) => item.baseUrl) || [];

	// We need at least one connection
	if (connectionsUrls.length > 0) {
		let selectedConnectionUrl: string | undefined = connectionsUrls[0];

		if (connectionsUrls.length > 1) {
			// We need to ask, it is not known
			selectedConnectionUrl = await vscode.window.showQuickPick(connectionsUrls, {
				placeHolder: 'Select Hlambda Server you want to issue the command!',
			});
		}

		console.log('selectedConnectionUrl', selectedConnectionUrl);

		// We need to find the connection with that name.
		const conn = connections.find((o) => {
			return o.baseUrl === selectedConnectionUrl;
		});

		// console.log(conn);
		const response = await conn?.fs?.clientAPI?.getEnvironments();

		// const newUri = vscode.Uri.parse('hyper-lambda-web-virtual-document:' + encodeURIComponent(response ?? ''));
		// const doc = await vscode.workspace.openTextDocument(newUri); // calls back into the provider
		// await vscode.window.showTextDocument(doc, { preview: false });

		const doc = await vscode.workspace.openTextDocument({
			content: response,
			language: 'json',
		});
		await vscode.window.showTextDocument(doc);
	}
};

export const registerGetEnvironmentsCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(
		vscode.commands.registerCommand('hyper-lambda.getEnvironmentsCommand', getEnvironmentsCommand)
	);
};

export default registerGetEnvironmentsCommands;
