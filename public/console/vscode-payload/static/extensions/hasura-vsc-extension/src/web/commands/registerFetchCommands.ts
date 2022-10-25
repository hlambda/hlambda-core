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
	console.log(`[${instanceOfExtension}|fetchCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	const method = await vscode.window.showQuickPick(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], {
		placeHolder: 'Select Hasura Server you want to issue the command!',
		// onDidSelectItem: (item) => vscode.window.showInformationMessage(`Focus: ${item}`),
	});

	const connectionsUrls = connections.map((item) => item.baseUrl) || [];

	// We need at least one connection
	if (connectionsUrls.length > 0) {
		const selectedConnectionUrl = await vscode.window.showQuickPick(connectionsUrls, {
			placeHolder: 'Select Hasura Server you want to issue the command!',
		});

		console.log('selectedConnectionUrl', selectedConnectionUrl);

		// console.log(conn);
		const urlPart = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Url',
			prompt: 'Enter endpoint',
			password: false,
			value: 'demo',
		});

		const runRequest = async (): Promise<String | undefined> => {
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
			return undefined;
		};
		const result = await runRequest();
		vscode.window.showInformationMessage(
			`[${instanceOfExtension}|reloadServerCommand]\nSuccess!\n<${commandExecutionInstance}>\n\n${result}`
		);
	}
};

export const registerFetchCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.fetchCommand', fetchCommand));
};

export default registerFetchCommands;
