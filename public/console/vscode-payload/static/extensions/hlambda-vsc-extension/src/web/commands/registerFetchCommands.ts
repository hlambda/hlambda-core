import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

import { connections } from './registerConnectCommands';

const fetchCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension} - fetchCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	const method = await vscode.window.showQuickPick(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], {
		placeHolder: 'Select Hlambda Server you want to issue the command!',
		// onDidSelectItem: (item) => vscode.window.showInformationMessage(`Focus: ${item}`),
	});

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

		if (typeof selectedConnectionUrl === 'undefined') {
			vscode.window.showInformationMessage(`Error... Unknown server URL.`);
			return;
		}

		const urlPart = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Url',
			prompt: 'Enter endpoint',
			password: false,
			value: 'demo',
		});

		const runRequest = async (): Promise<string | undefined> => {
			console.log(`Calling: ${selectedConnectionUrl}/${urlPart}`);
			const response = await fetch(`${selectedConnectionUrl}/${urlPart}`, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});

			let resultRequestText = await response.text();
			if (response.ok) {
				return resultRequestText;
			}
			console.log(resultRequestText);
			return resultRequestText;
		};
		const response = await runRequest();
		// vscode.window.showInformationMessage(
		// 	`[${instanceOfExtension} - fetchCommand]\nSuccess!\n<${commandExecutionInstance}>\n\n${response}`
		// );

		// const newUri = vscode.Uri.parse('hyper-lambda-web-virtual-document:' + response);
		// const doc = await vscode.workspace.openTextDocument(newUri); // calls back into the provider
		// await vscode.window.showTextDocument(doc, { preview: false });

		const doc = await vscode.workspace.openTextDocument({
			content: response,
			language: 'text',
		});
		await vscode.window.showTextDocument(doc);
	}
};

export const registerFetchCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hyper-lambda.fetchCommand', fetchCommand));
};

export default registerFetchCommands;
