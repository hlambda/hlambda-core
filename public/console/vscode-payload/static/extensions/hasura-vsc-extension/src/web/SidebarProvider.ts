import * as vscode from 'vscode';
import { getNonce } from './getNonce';

export class SidebarProvider implements vscode.WebviewViewProvider {
	_view?: vscode.WebviewView;
	_doc?: vscode.TextDocument;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [this._extensionUri],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case 'onInfo': {
					if (!data.value) {
						return;
					}
					vscode.window.showInformationMessage(data.value);
					break;
				}
				case 'onError': {
					if (!data.value) {
						return;
					}
					vscode.window.showErrorMessage(data.value);
					break;
				}
			}
		});
	}

	public revive(panel: vscode.WebviewView) {
		this._view = panel;
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// const styleResetUri = webview.asWebviewUri(
		//   vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
		// );
		// const scriptUri = webview.asWebviewUri(
		//   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
		// );
		// const styleMainUri = webview.asWebviewUri(
		//   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
		// );
		// const styleVSCodeUri = webview.asWebviewUri(
		//   vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
		// );

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return /* HTML */ `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
					<meta
						http-equiv="Content-Security-Policy"
						content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';"
					/>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					${
						/*`<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
  <link href="${styleMainUri}" rel="stylesheet">`*/ ''
					}
					<script nonce="${nonce}">
						const tsvscode = acquireVsCodeApi();
					</script>
				</head>
				<body>
					<h3>Hasura Extension</h3>
					<div>
						<p>This extension provides access to the Hasura console actions and GraphQL schema introspection.</p>
					</div>
					<ul>
						<li>You can run Hasura: Connect</li>
						<li>You can run Hasura: Disconnect</li>
						<li>You can run Hasura: Get GraphQL Schema</li>
						<li>You can run Hasura: List Custom Actions</li>
					</ul>
					<script nonce="${nonce}" src="${/* scriptUri */ ''}"></script>
				</body>
			</html>`;
	}
}
