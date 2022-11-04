import * as vscode from 'vscode';

export class VirtualDocumentProvider implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		return decodeURIComponent(uri.path);
	}
}

export const createVirtualDocumentProvider = () => new VirtualDocumentProvider();
