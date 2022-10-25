import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

const getConstantsCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension}|getConstantsCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// Output the results of the command
	await vscode.window.showInformationMessage(
		`[${instanceOfExtension}|getConstantsCommand]\nExecuted!\n<${commandExecutionInstance}>`
	);
};

export const registerGetConstantsCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.getConstantsCommand', getConstantsCommand));
};

export default registerGetConstantsCommands;
