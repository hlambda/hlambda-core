import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

// Number of connections to remotes
export type Connection = {
	name: string;
	connectionId: string;
	baseUrl: string;
	adminSecret: string;
};
export const connections: Connection[] = [];

const connectCommand = async () => {
	const instanceOfExtension = getInstanceOfExtension();
	console.log('[connectCommand] Executed!');
	const commandExecutionInstance = `${uuidv4()}`.substr(-8);
	console.log(`[${instanceOfExtension}setupCommand] Executed! ${commandExecutionInstance}`);

	const context = getExtensionContext();

	// Get the values from user

	// const target = await vscode.window.showQuickPick(
	//   [
	//     { label: 'User', description: 'User Settings', target: vscode.ConfigurationTarget.Global },
	//     { label: 'Workspace', description: 'Workspace Settings', target: vscode.ConfigurationTarget.Workspace }
	//   ],
	//   { placeHolder: 'Select the view to show when opening a window.' });

	const url = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: 'Url',
		prompt: 'Enter an Hasura Url.',
		password: false,
		value: 'http://localhost:8080',
	});

	if (typeof url !== 'string') {
		return;
	}

	const adminSecret = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: 'Admin Secret',
		prompt: 'Enter an Hasura Admin Secret.',
		password: true,
		value: 'demo',
	});

	if (typeof adminSecret !== 'string') {
		return;
	}

	console.log(url, adminSecret);

	// // Create temp inmem workspace, for proto-typing.
	// const memFs = new MemFS();
	// context.subscriptions.push(vscode.workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));
	// vscode.workspace.updateWorkspaceFolders(1, 0, { uri: vscode.Uri.parse('memfs:/'), name: 'InMemory Workbox' });

	// Create the instance of RemoteRESTFS file system provider. (Every RemoteRESTFS has it's own instance of clientAPI)
	const createNewConnection = async (url: string, adminSecret: string) => {
		const connectionId = uuidv4(); // domain_from_url(url); // uuidv4();

		return {
			name: `hasura-web-${connectionId}`,
			connectionId,
			baseUrl: url,
			adminSecret,
		};
	};
	connections.push(await createNewConnection(url, adminSecret));

	await vscode.window.showInformationMessage(`${instanceOfExtension} Connect! ${commandExecutionInstance}`);
};

export const registerConnectCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.connectCommand', connectCommand));
};

export default registerConnectCommands;
