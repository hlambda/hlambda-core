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
import { basename } from 'path';

// Load all the dependencies
import { setInstanceOfExtension, getInstanceOfExtension } from './helpers/instanceOfExtension';
import { setExtensionContext } from './helpers/context';

// Import commands
import { registerSetupCommands } from './commands/registerSetupCommands';
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
import { MemFS } from './inMemFileSystemProvider';
// import { browserUrlManager } from './browserUrlManager';

import { SidebarProvider } from './SidebarProvider';

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

	// // Register platform adapters
	// await registerAdapters();

	// // Ensure the router has been initialized
	// await router.initialize(browserUrlManager);

	// Do follow-up works in parallel
	await Promise.all([
		// registerVSCodeProviders(),
		// registerEventListeners(),

		// Register all commands
		registerSetupCommands(context),
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

	// initialVSCodeState();

	// Init and create sidebar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('hlambda-sidebar', sidebarProvider));

	// Init and create status bar
	// TODO: create status bar view

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
		}, 1500);

		memFs.writeFile(
			vscode.Uri.parse(`memfs:/README.md`),
			Buffer.from(
				'Hello! This is a file saved in your in memory file system. Use can use this workspace as a temorary storage.'
			),
			{ create: true, overwrite: true }
		);

		return true;
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

	// Hack to get data from browser hosting the vscode
	const getWindowLocationOriginFromBrowsersLocalStorage = () => {
		return new Promise((resolve) => {
			return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getBrowserOrigin').then(
				(data: any) => {
					resolve(data);
				},
				() => resolve(undefined)
			);
		});
	};
	const getAdminSecretFromBrowsersLocalStorage = () => {
		return new Promise((resolve) => {
			return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getAdminSecret').then(
				(data: any) => {
					resolve(data);
				},
				() => resolve(undefined)
			);
		});
	};

	const origin = await getWindowLocationOriginFromBrowsersLocalStorage();
	console.log('origin', origin);

	const adminSecret = await getAdminSecretFromBrowsersLocalStorage();
	console.log('adminSecret', adminSecret);

	if (origin && adminSecret) {
		vscode.window.showInformationMessage(`Found secet in the browsers local storage, connecting automatically.`);
		await connectCommand(origin, adminSecret, 'default');
	} else {
		vscode.window.showInformationMessage(`No admin secret found in local storage! Please connect manually.`);
	}

	// Now it is done, we await connectCommand, such that provider is ready.
	return;
};

// This method is called when your extension is deactivated
export async function deactivate() {
	console.log('[hlambda-extension] Stoping "hyper-lambda" extension');
}
