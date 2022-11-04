import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

const disconnectCommand = async () => {
	const instanceOfExtension = getInstanceOfExtension();
	console.log('[disconnectCommand] Executed!');
	const commandExecutionInstance = `${uuidv4()}`.slice(-8);
	console.log(`[${instanceOfExtension} - disconnectCommand] Executed! ${commandExecutionInstance}`);

	// TODO: Implement.

	vscode.window.showInformationMessage(`${instanceOfExtension} Disconnected! ${commandExecutionInstance}`);
};

export const registerDisconnectCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(
		vscode.commands.registerCommand('hyper-lambda.disconnectCommand', disconnectCommand)
	);
};

export default registerDisconnectCommands;
