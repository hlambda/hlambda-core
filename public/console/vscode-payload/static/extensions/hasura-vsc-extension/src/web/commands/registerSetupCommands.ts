import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';

import { getInstanceOfExtension } from '../helpers/instanceOfExtension';
import { getExtensionContext } from './../helpers/context';

const setupCommand = async () => {
	const instanceOfExtension = getInstanceOfExtension();
	const commandExecutionInstance = `${uuidv4()}`.substr(-8);
	console.log(`[${instanceOfExtension}setupCommand] Executed! ${commandExecutionInstance}`);

	const context = getExtensionContext();

	//   const response = await fetch('http://localhost:8081/console/api/v1/logs?type=text', {
	// 	headers: {
	// 	  Accept: 'application/json',
	// 	  'X-Hasura-Admin-Secret': 'demo',
	// 	},
	//   });

	//   let resultRequestText = await response.text();
	//   if (response.ok) {
	// 	console.log(resultRequestText);
	//   }

	//   const adminSecret = storageManager.getAdminSecret();
	//   console.log('Server admin secret:', adminSecret);

	//   const serverURL = await vscode.window.showInputBox({ title: 'Hasura server url' });
	//   const serverAdminSecret = await vscode.window.showInputBox({ title: 'Hasura admin secret' });

	//   if (serverURL) {
	// 	storageManager.setUrl(serverURL);
	//   }
	//   if (serverAdminSecret) {
	// 	storageManager.setAdminSecret(serverAdminSecret);
	//   }
	//   // await vscode.window.showInformationMessage(`1Store: ${JSON.stringify(store, null, 2)}`);

	//   // sidebarProvider.revive()

	//   await remoteRESTFS.writeFile(
	// 	vscode.Uri.parse(`hasura-web:/logs.txt`),
	// 	Buffer.from(resultRequestText.replace(/\\n/g, '\n')),
	// 	{ create: true, overwrite: true }
	//   );
	//   await remoteRESTFS.writeFile(
	// 	vscode.Uri.parse(`hasura-web:/matea.txt`),
	// 	Buffer.from('Matea ❤️❤️❤️❤️❤️❤️❤️❤️❤️'),
	// 	{
	// 	  create: true,
	// 	  overwrite: true,
	// 	}
	//   );

	//   await vscode.window.showInformationMessage(
	// 	` ${JSON.stringify(response.body, null, 2)} 2Store: ${storageManager.getUrl()} ${storageManager.getAdminSecret()}`
	//   );

	await vscode.window.showInformationMessage(`${instanceOfExtension} Setup! ${commandExecutionInstance}`);
};

export const registerSetupCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(vscode.commands.registerCommand('hasura.setupCommand', setupCommand));
};

export default registerSetupCommands;
