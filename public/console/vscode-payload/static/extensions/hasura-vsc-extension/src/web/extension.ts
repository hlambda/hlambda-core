import * as vscode from 'vscode';
import { Buffer } from 'buffer';

import {
	ExtensionContext,
	StatusBarAlignment,
	window,
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
import { registerConnectCommands } from './commands/registerConnectCommands';
import { registerDisconnectCommands } from './commands/registerDisconnectCommands';
import { registerRunShellCommands } from './commands/registerRunShellCommands';
import { registerFetchCommands } from './commands/registerFetchCommands';
import { registerExportMetadataCommands } from './commands/registerExportMetadataCommands';
import { registerImportMetadataCommands } from './commands/registerImportMetadataCommands';
import { registerDebugCommands } from './commands/registerDebugCommands';

// Providers
import { SidebarProvider } from './SidebarProvider';

// Set the name of extension
export const extensionName = 'hasura';

export async function activate(context: vscode.ExtensionContext) {
	console.log(`[${extensionName}-extension] Starting "hasura" extension, and is now active in the web extension host!`);

	// Set reference to the extension instance uuid, useful if you are debugging the extension.
	setInstanceOfExtension();

	const instanceOfExtension = getInstanceOfExtension();
	console.log(`Instance of the extension: ${instanceOfExtension}`);

	// Set the global context for convenient
	setExtensionContext(context);

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
		registerDebugCommands(context),

		// registerCustomViews(),
		// updateSourceControlChanges(),
		// decorateStatusBar(),
	]);

	// initialVSCodeState();

	//globalReference.storageManager = storageManager;

	// Create API client.
	console.log(`[hasura-extension] Creating client for url ${'url'}`);

	// Init and create sidebar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('hasura-sidebar', sidebarProvider));

	// Init and create status bar
	// TODO: create status bar view

	// We need to know to wicht connection we want to execute this command.
	//   let setupCommandDisposable = vscode.commands.registerCommand('hasura.reloadServerCommand', async () => {
	//     console.log('[Hasura - Reload Server Command] Executed!');

	//     const responseResult = await clientAPI
	//       .restartServer()
	//       .then((data) => {
	//         return data;
	//       })
	//       .catch((error: any) => {
	//         console.error(error);
	//       });
	//     console.log(responseResult);
	//   });
	//   context.subscriptions.push(setupCommandDisposable);

	initialVSCodeState();

	// Create a status bar item
	const status = window.createStatusBarItem(StatusBarAlignment.Left, 1000000);
	context.subscriptions.push(status);

	// Update status bar item based on events for multi root folder changes
	context.subscriptions.push(workspace.onDidChangeWorkspaceFolders((e) => updateStatus(status)));

	// Update status bar item based on events for configuration
	context.subscriptions.push(workspace.onDidChangeConfiguration((e) => updateStatus(status)));

	// Update status bar item based on events around the active editor
	context.subscriptions.push(window.onDidChangeActiveTextEditor((e) => updateStatus(status)));
	context.subscriptions.push(window.onDidChangeTextEditorViewColumn((e) => updateStatus(status)));
	context.subscriptions.push(workspace.onDidOpenTextDocument((e) => updateStatus(status)));
	context.subscriptions.push(workspace.onDidCloseTextDocument((e) => updateStatus(status)));

	updateStatus(status);
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
	const editor = window.activeTextEditor;

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
const initialVSCodeState = async () => {};

// This method is called when your extension is deactivated
export async function deactivate() {
	console.log('[hasura-extension] Stoping "hasura" extension');
}
