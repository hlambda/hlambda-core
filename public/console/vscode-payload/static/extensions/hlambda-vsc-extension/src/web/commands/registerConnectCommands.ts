import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';

import { RemoteRESTFS } from './../file-system/fileSystemProvider';
import { RemoteRESTTerminal } from './../terminal/RemoteRESTTerminal';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

// Number of connections to remotes
export type Connection = {
	name: string;
	connectionId: string;
	baseUrl: string;
	adminSecret: string;
	fs: RemoteRESTFS;
};
export const connections: Connection[] = [];

export const connectCommand = async (
	inputUrl: any,
	inputAdminSecret: any,
	defaultConnectionId: any,
	showTerminal: boolean = false
) => {
	const instanceOfExtension = getInstanceOfExtension();
	console.log('[connectCommand] Executed!');
	const commandExecutionInstance = `${uuidv4()}`.slice(-8);
	console.log(`[${instanceOfExtension} - connectCommand] Executed! ${commandExecutionInstance}`);

	const context = getExtensionContext();

	let url: any = inputUrl;
	let adminSecret: any = inputAdminSecret;

	if (inputUrl && inputAdminSecret) {
		// Do nothing, we have inputs, no need to ask anything.
	} else {
		url = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Url',
			prompt: 'Enter an Hlambda Url.',
			password: false,
			value: 'http://localhost:8081',
		});

		if (typeof url !== 'string') {
			return;
		}

		adminSecret = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Admin Secret',
			prompt: 'Enter an Hlambda Admin Secret.',
			password: true,
			value: 'demo',
		});

		if (typeof adminSecret !== 'string') {
			return;
		}
	}

	if (typeof url !== 'string') {
		return;
	}

	if (typeof adminSecret !== 'string') {
		return;
	}

	// Create the instance of RemoteRESTFS file system provider. (Every RemoteRESTFS has it's own instance of clientAPI)
	const createNewConnection = async (
		url: string,
		adminSecret: string,
		defaultConnectionId: string | undefined,
		showTerminal: boolean = false
	) => {
		const connectionId = defaultConnectionId ?? uuidv4(); // domain_from_url(url); // uuidv4();
		const remoteRESTFS = new RemoteRESTFS(url, adminSecret);
		const terminal = new RemoteRESTTerminal(url, adminSecret, showTerminal);

		// const kek = await remoteRESTFS.clientAPI.readDirectory('./');
		// console.log(kek);

		context.subscriptions.push(
			vscode.workspace.registerFileSystemProvider(`hyper-lambda-web-${connectionId}`, remoteRESTFS, {
				isCaseSensitive: true,
			})
		);

		// It is super important that start is set to 1, because updates to the first folder in workbench destroys/restarts all extensions!!!
		vscode.workspace.updateWorkspaceFolders(
			vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
			null,
			{
				uri: vscode.Uri.parse(`hyper-lambda-web-${connectionId}:/`),
				name: `Hlambda - Server | ${url}`,
			}
		);

		return {
			name: `hyper-lambda-web-${connectionId}`,
			connectionId,
			baseUrl: url,
			adminSecret,
			fs: remoteRESTFS,
			terminal,
		};
	};
	connections.push(await createNewConnection(url, adminSecret, defaultConnectionId, showTerminal));

	if (!defaultConnectionId) {
		vscode.window.showInformationMessage(`${instanceOfExtension} Connect! ${commandExecutionInstance}`);
	}
};

export const registerConnectCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hyper-lambda.connectCommand', connectCommand));
};

export default registerConnectCommands;
