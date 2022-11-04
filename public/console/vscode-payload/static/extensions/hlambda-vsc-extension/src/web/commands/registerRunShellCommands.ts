import * as vscode from 'vscode';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

import { createInstance } from '../helpers/instanceOfCommand';

const runShellCommand = async () => {
	// Set instances
	const instanceOfExtension = getInstanceOfExtension();
	const instanceOfCommand = createInstance();

	const commandExecutionInstance = `${instanceOfCommand.getInstance()}`;
	console.log(`[${instanceOfExtension}|runShellCommand]\nExecuted!\n<${commandExecutionInstance}>`);

	const context = getExtensionContext();

	// Output the results of the command
	await vscode.window.showInformationMessage(
		`[${instanceOfExtension}|runShellCommand]\nExecuted!\n<${commandExecutionInstance}>`
	);
};

export const registerRunShellCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hyper-lambda.runShellCommand', runShellCommand));
};

export default registerRunShellCommands;
