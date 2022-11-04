import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

const getGraphQLSchema = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension} | getGraphQLSchema]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// Output the results of the command
	await vscode.window.showInformationMessage(
		`[${instanceOfExtension}. | getGraphQLSchema]\nExecuted!\n<${commandExecutionInstance}>`
	);
};

export const registerGetGraphQLSchemaCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.getGraphQLSchema', getGraphQLSchema));
};

export default registerGetGraphQLSchemaCommands;
