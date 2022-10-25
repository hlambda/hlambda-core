import * as vscode from 'vscode';

const disconnectCommand = async () => {
	console.log('[disconnectCommand] Executed!');
};

export const registerDisconnectCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(
		vscode.commands.registerCommand('hyper-lambda.disconnectCommand', disconnectCommand)
	);
};

export default registerDisconnectCommands;
