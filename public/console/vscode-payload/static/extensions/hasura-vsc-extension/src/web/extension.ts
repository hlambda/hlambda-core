import * as vscode from 'vscode';

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

// Load all the dependencies
import { setInstanceOfExtension, getInstanceOfExtension } from './helpers/instanceOfExtension';
import { setExtensionContext } from './helpers/context';

// Import commands
import { registerConnectCommands } from './commands/registerConnectCommands';
import { registerDisconnectCommands } from './commands/registerDisconnectCommands';
import { registerGetGraphQLSchemaCommands } from './commands/registerGetGraphQLSchemaCommands';
import { registerGetCustomActionsCommands } from './commands/registerGetCustomActionsCommands';
import { registerDebugCommands } from './commands/registerDebugCommands';

// Providers
import { SidebarProvider } from './sidebar/SidebarProvider';

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

	// Init and create sidebar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('hasura-sidebar', sidebarProvider));

	// Do follow-up works in parallel
	await Promise.all([
		// Register all commands
		registerConnectCommands(context),
		registerDisconnectCommands(context),
		registerGetGraphQLSchemaCommands(context),
		registerGetCustomActionsCommands(context),
		registerDebugCommands(context),
		// Misc
		decorateStatusBar(context),
	]);

	initialVSCodeState();
}

function updateStatus(status: StatusBarItem): void {
	status.text = 'Hasura';
	status.tooltip = 'Hasura Extension';
	status.color = '#26f1e0';
	status.show();
}

const decorateStatusBar = async (context: vscode.ExtensionContext) => {
	// Create a status bar item
	const status = window.createStatusBarItem(StatusBarAlignment.Left, 1000000);
	context.subscriptions.push(status);
	updateStatus(status);

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
};

const initialVSCodeState = async () => {};

// This method is called when your extension is deactivated
export async function deactivate() {
	console.log('[hasura-extension] Stoping "hasura" extension');
}
