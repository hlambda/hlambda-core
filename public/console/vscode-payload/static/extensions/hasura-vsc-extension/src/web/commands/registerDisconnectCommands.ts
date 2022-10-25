import * as vscode from 'vscode';

const disconnectCommand = async () => {
	console.log('[disconnectCommand] Executed!');
};

export const registerDisconnectCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.disconnectCommand', disconnectCommand));
};

export default registerDisconnectCommands;
