import * as vscode from 'vscode';
import { Buffer } from 'buffer';

import {
	ExtensionContext,
	StatusBarAlignment,
	StatusBarItem,
	Selection,
	workspace,
	TextEditor,
	commands,
} from 'vscode';
import { basename, posix } from 'path';

// Load all the dependencies
import { setInstanceOfExtension, getInstanceOfExtension } from './helpers/instanceOfExtension';
import { setExtensionContext } from './helpers/context';

// Import commands
import { registerConnectCommands, connectCommand } from './commands/registerConnectCommands';
import { registerDisconnectCommands } from './commands/registerDisconnectCommands';
import { registerRunShellCommands } from './commands/registerRunShellCommands';
import { registerFetchCommands } from './commands/registerFetchCommands';
import { registerExportMetadataCommands } from './commands/registerExportMetadataCommands';
import { registerImportMetadataCommands } from './commands/registerImportMetadataCommands';
import { registerGetLogsCommands } from './commands/registerGetLogsCommands';
import { registerGetEnvironmentsCommands } from './commands/registerGetEnvironmentsCommands';
import { registerGetConstantsCommands } from './commands/registerGetConstantsCommands';
import { registerReloadServerCommands } from './commands/registerReloadServerCommands';
import { registerDebugCommands } from './commands/registerDebugCommands';

import { activateTerminal } from './terminal/RemoteRESTTerminal';

// Providers
import { MemFS } from './file-system/inMemFileSystemProvider';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { VirtualDocumentProvider } from './file-system/virtualDocumentProvider';

// Browser communicator
import {
	getWindowLocationOriginFromBrowserHostingVSC,
	getAdminSecretFromBrowsersLocalStorage,
	getWindowLocationUrlFromBrowserHostingVSC,
	getWindowLocationHashFromBrowserHostingVSC,
} from './browser';

// Set the name of extension
export const extensionName = 'hlambda';

export async function activate(context: vscode.ExtensionContext) {
	console.log(
		`[${extensionName}-extension] Starting "hyper-lambda" extension, and is now active in the web extension host!`
	);

	// Set reference to the extension instance uuid, useful if you are debugging the extension.
	setInstanceOfExtension();

	const instanceOfExtension = getInstanceOfExtension();
	console.log(`Instance of the extension: ${instanceOfExtension}`);

	// Set the global context for convenient
	setExtensionContext(context);

	// Activating terminal in the web extension shows
	// Register terminal
	activateTerminal(context);

	// Do follow-up works in parallel
	await Promise.all([
		// registerVSCodeProviders(),
		// registerEventListeners(),

		// Register all commands
		registerConnectCommands(context),
		registerDisconnectCommands(context),
		registerRunShellCommands(context),
		registerFetchCommands(context),
		registerExportMetadataCommands(context),
		registerImportMetadataCommands(context),
		registerGetLogsCommands(context),
		registerGetEnvironmentsCommands(context),
		registerGetConstantsCommands(context),
		registerReloadServerCommands(context),
		registerDebugCommands(context),

		// registerCustomViews(),
		// updateSourceControlChanges(),
		// decorateStatusBar(),
	]);

	// Init and create sidebar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('hlambda-sidebar', sidebarProvider));

	// Create virtual document provider with scheme
	const instanceOfVirtualDocumentProvider = new VirtualDocumentProvider();
	vscode.workspace.registerTextDocumentContentProvider(
		'hyper-lambda-web-virtual-document',
		instanceOfVirtualDocumentProvider
	);

	const disposable = vscode.commands.registerCommand('hlambda.workbench.init-workbench', (_) => {
		console.log('Init inmem workbench');

		// Add first inMemFS
		const memFs = new MemFS();
		const disposable = vscode.workspace.registerFileSystemProvider(`memfs`, memFs, {
			isCaseSensitive: true,
		});
		context.subscriptions.push(disposable);

		// Hack to mitigate race condition for updateWorkspaceFolders TODO: Fix please
		setTimeout(() => {
			vscode.workspace.updateWorkspaceFolders(
				vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
				null,
				{
					uri: vscode.Uri.parse(`memfs:/`),
					name: `InMem Workbench`,
				}
			);
		}, 1000);

		memFs.writeFile(
			vscode.Uri.parse(`memfs:/README.md`),
			Buffer.from(
				'Hello! This is a file saved in your in memory file system. You can use this workspace as a temorary storage.'
			),
			{ create: true, overwrite: true }
		);
	});
	context.subscriptions.push(disposable);

	await initialVSCodeState();

	// // Create a status bar item
	// const status = vscode.window.createStatusBarItem(StatusBarAlignment.Left, 1000000);
	// context.subscriptions.push(status);

	// // Update status bar item based on events for multi root folder changes
	// context.subscriptions.push(workspace.onDidChangeWorkspaceFolders((e) => updateStatus(status)));

	// // Update status bar item based on events for configuration
	// context.subscriptions.push(workspace.onDidChangeConfiguration((e) => updateStatus(status)));

	// // Update status bar item based on events around the active editor
	// context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => updateStatus(status)));
	// context.subscriptions.push(vscode.window.onDidChangeTextEditorViewColumn((e) => updateStatus(status)));
	// context.subscriptions.push(workspace.onDidOpenTextDocument((e) => updateStatus(status)));
	// context.subscriptions.push(workspace.onDidCloseTextDocument((e) => updateStatus(status)));

	// updateStatus(status);
}

function updateStatus(status: StatusBarItem): void {
	const info = getEditorInfo();
	status.text = info ? info.text || '' : '';
	status.tooltip = info ? info.tooltip : undefined;
	status.color = info ? info.color : undefined;
	console.log('status', status);
	if (info) {
		status.show();
	} else {
		status.hide();
	}
}

function getEditorInfo(): { text?: string; tooltip?: string; color?: string } | null {
	const editor = vscode.window.activeTextEditor;

	// If no workspace is opened or just a single folder, we return without any status label
	// because our extension only works when more than one folder is opened in a workspace.
	if (!editor || !workspace.workspaceFolders || workspace.workspaceFolders.length < 2) {
		return null;
	}

	let text: string | undefined;
	let tooltip: string | undefined;
	let color: string | undefined;

	// If we have a file:// resource we resolve the WorkspaceFolder this file is from and update
	// the status accordingly.
	const resource = editor.document.uri;
	console.log('resource', resource);

	const folder = workspace.getWorkspaceFolder(resource);

	console.log('folder', folder);
	if (!folder) {
		text = `$(alert) <outside workspace> → ${basename(resource.fsPath)}`;
	} else {
		text = `$(file-submodule) ${basename(folder.uri.fsPath)} (${folder.index + 1} of ${
			workspace.workspaceFolders.length
		}) → $(file-code) ${basename(resource.fsPath)}`;
		tooltip = resource.fsPath;

		const multiRootConfigForResource = workspace.getConfiguration('multiRootSample', resource);
		color = multiRootConfigForResource.get('statusColor');
	}

	console.log(text);
	return { text, tooltip, color };
}

// Initialize the VSCode's state according to the router url or something else
const initialVSCodeState = async () => {
	await vscode.commands.executeCommand('hlambda.workbench.init-workbench');

	// We check for browsers full url, we parse the string after hash to get the details of the default file we want to open.
	const windowUrl: any = await getWindowLocationUrlFromBrowserHostingVSC();
	const windowLocationHash: any = await getWindowLocationHashFromBrowserHostingVSC();
	// console.log('url', windowUrl); // window.location.href;
	// console.log('windowLocationHash', windowLocationHash); // window.location.href;
	let shouldShowTerminalByDefault: string | null = null;
	if (windowUrl) {
		// Parse url, get the path
		const parsedHash = new URLSearchParams(
			decodeURIComponent(windowLocationHash?.substring(1) ?? '') // Skip the first char (#) and / from swagger
		);
		shouldShowTerminalByDefault = parsedHash.get('openDefaultShell');
	}

	// Then get provider and connection
	const origin = await getWindowLocationOriginFromBrowserHostingVSC();
	console.log('origin', origin);

	const adminSecret = await getAdminSecretFromBrowsersLocalStorage();
	console.log('adminSecret', adminSecret);
	if (origin && adminSecret) {
		vscode.window.showInformationMessage(`Found secet in the browsers local storage, connecting automatically.`);
		await connectCommand(origin, adminSecret, 'default', !!shouldShowTerminalByDefault);

		// Get all active extensions
		const HASURA_EXTENSION_ID = 'undefined.hasura';
		console.log('Total number of extensions:', vscode.extensions.all.length);
		console.log(
			'Extensions',
			vscode.extensions.all.find((item) => {
				return item.id.includes('hasura');
			})
		);
		const extension = await vscode.extensions.getExtension(HASURA_EXTENSION_ID);
		if (extension) {
			console.log('We have the Hasura extension, calling connect command');
			// Get the env data first, extract admin secret and url.

			// Pass this to the Hasura extension to create new connection.
		}
		console.log('hasura-vsc-extension', extension);
	} else {
		vscode.window.showInformationMessage(`No admin secret found in local storage! Please connect manually.`);
	}

	// Only after provider load default file
	if (windowUrl) {
		// Parse url, get the path
		const parsedHash = new URLSearchParams(
			decodeURIComponent(windowLocationHash?.substring(1) ?? '') // Skip the first char (#) and / from swagger
		);

		const defaultFile = parsedHash.get('defaultFile');
		//console.log('defaultFile', defaultFile);
		if (defaultFile) {
			const jsUri = vscode.Uri.parse(defaultFile);

			try {
				await vscode.workspace.fs.stat(jsUri);
				// vscode.window.showTextDocument(jsUri, { viewColumn: vscode.ViewColumn.Beside });
				vscode.window.showTextDocument(jsUri);
			} catch {
				// No need to show error message, just ignore.
				// vscode.window.showInformationMessage(`${jsUri.toString(true)} file does *not* exist`);
			}
		}

		shouldShowTerminalByDefault = parsedHash.get('openDefaultShell');
	}

	return;
};

// This method is called when your extension is deactivated
export async function deactivate() {
	console.log('[hlambda-extension] Stoping "hyper-lambda" extension');
}
