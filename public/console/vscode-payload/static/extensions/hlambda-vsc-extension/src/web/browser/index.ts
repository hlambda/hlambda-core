import * as vscode from 'vscode';

// Hack to get data from browser hosting the vscode
export const getWindowLocationOriginFromBrowserHostingVSC = () => {
	return new Promise((resolve) => {
		return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getBrowserOrigin').then(
			(data: any) => {
				resolve(data);
			},
			() => resolve(undefined)
		);
	});
};

export const getAdminSecretFromBrowsersLocalStorage = () => {
	return new Promise((resolve) => {
		return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getAdminSecret').then(
			(data: any) => {
				resolve(data);
			},
			() => resolve(undefined)
		);
	});
};

export const getWindowLocationUrlFromBrowserHostingVSC = () => {
	return new Promise((resolve) => {
		return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getBrowserUrl').then(
			(data: any) => {
				resolve(data);
			},
			() => resolve(undefined)
		);
	});
};

export const getWindowLocationHashFromBrowserHostingVSC = () => {
	return new Promise((resolve) => {
		return vscode.commands.executeCommand('hyper-lambda.commands.vscode.getBrowserHash').then(
			(data: any) => {
				resolve(data);
			},
			() => resolve(undefined)
		);
	});
};
