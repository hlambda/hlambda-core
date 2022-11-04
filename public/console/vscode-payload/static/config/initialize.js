(function () {
	/*** begin config block ***/
	const staticAssetsPath =
		'/console/vscode-payload/static' + (window.staticHashCode ? '/' + window.staticHashCode : '');
	const staticAssetsPrefix = window.location.origin + staticAssetsPath;
	const nodeModulesPrefix = staticAssetsPrefix + '/node_modules';

	Object.keys(self.webPackagePaths).forEach((key) => {
		self.webPackagePaths[key] = `${nodeModulesPrefix}/${key}/${self.webPackagePaths[key]}`;
	});
	// config vscode loader
	if (window.require && window.require.config) {
		window.require.config({
			baseUrl: staticAssetsPrefix + '/vscode',
			paths: self.webPackagePaths,
		});
	}

	// set workbench config
	let platformName = 'Hlambda';
	let logoIcon = staticAssetsPrefix + '/config/hlambda.svg';
	let repository = 'Hyper Lambda';
	let workspaceLabel = 'Hlambda Workspace';

	// set product.json
	const productConfiguration = {
		nameShort: 'Hyper Lambda',
		nameLong: 'Hyper Lambda',
		applicationName: 'Hyper Lambda',
		reportIssueUrl: 'https://github.com/hlambda/hlambda-core/issues/new',
		extensionsGallery: {
			serviceUrl: 'https://marketplace.visualstudio.com/_apis/public/gallery',
			cacheUrl: 'https://vscode.blob.core.windows.net/gallery/index',
			itemUrl: 'https://marketplace.visualstudio.com/items',
			resourceUrlTemplate: 'https://{publisher}.vscode-unpkg.net/{publisher}/{name}/{version}/{path}',
			controlUrl: 'https://az764295.vo.msecnd.net/extensions/marketplace.json',
			recommendationsUrl: 'https://az764295.vo.msecnd.net/extensions/workspaceRecommendations.json.gz',
		},
		linkProtectionTrustedDomains: ['*.github.com', '*.npmjs.com', '*.npmjs1s.com', '*.microsoft.com'],
		extensionEnabledApiProposals: { 'ms-vscode.anycode': ['extensionsAny'] },
	};
	/*** end config block ***/

	/*** begin notificaton block ***/
	const renderNotification = () => {
		// const NOTIFICATION_STORAGE_KEY = 'GITHUB1S_NOTIFICATION';
		// // Change this if a new notification should be shown
		// const NOTIFICATION_STORAGE_VALUE = '20210212';
		// // If user has confirmed the notification and checked `don't show me again`, ignore it
		// if (window.localStorage.getItem(NOTIFICATION_STORAGE_KEY) === NOTIFICATION_STORAGE_VALUE) {
		// 	return;
		// }
		// // prettier-ignore
		// const notifications = [{
		// 	title: 'ATTENTION: This page is NOT officially provided by ' + platformName + '.',
		// 	content: platformName + '1s is an open source project, which is not officially provided by ' + platformName + '.',
		// 	link: 'https://github.com/conwnet/github1s',
		// }];
		// const notificationStylesText =
		// 	'.github1s-notification{display:block;position:fixed;left:0;right:0;bottom:0;height:60px;' +
		// 	'z-index:999;display:flex;box-shadow:1px 1px 5px 3px #1e1e1e;background:rgba(0,0,0,.8);font-size:14px}' +
		// 	'.github1s-notification .notification-main{flex:1;padding:0 20px;display:flex;flex-direction:column;' +
		// 	'justify-content:center;overflow:hidden}.github1s-notification .notification-main .notification-title{' +
		// 	'color:#ffe58f;font-size:16px;margin-bottom:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}' +
		// 	'.github1s-notification .notification-main .notification-content{color:#ccc;font-size:13px;overflow:hidden;' +
		// 	'white-space:nowrap;text-overflow:ellipsis}.github1s-notification .notification-main .notification-link{' +
		// 	'color:#3794ff;text-decoration:none}.github1s-notification .notification-main .notification-link:focus{' +
		// 	'outline:1px solid #007fd4;outline-offset:-1px}.github1s-notification .notification-footer{padding-right:' +
		// 	'20px;display:flex;flex-direction:column;justify-content:center;min-width:140px}.github1s-notification ' +
		// 	'.notification-footer .notification-confirm-button{border:none;width:100%;height:26px;margin-bottom:2px;' +
		// 	'text-align:center;outline:1px solid transparent;outline-offset:2px!important;color:#fff;background-color:' +
		// 	'#0e639c;cursor:pointer}.github1s-notification .notification-footer .notification-confirm-button:hover{' +
		// 	'background-color:#17b}.github1s-notification .notification-footer .notification-confirm-button:focus{' +
		// 	'outline-color:#007fd4}.github1s-notification .notification-footer .notification-show-me-again{color:#ccc;' +
		// 	'font-size:12px;display:flex;align-items:center}';
		// const styleElement = document.createElement('style');
		// styleElement.innerHTML = notificationStylesText;
		// document.head.appendChild(styleElement);
		// // prettier-ignore
		// const notificationBlocksHtml = notifications.map((item) => {
		// 		const linkHtml = item.link ? ' <a class="notification-link" href="' + item.link + '" target="_blank">See more</a>' : '';
		// 		const titleHtml = '<div class="notification-main"><div class="notification-title">' + item.title + '</div>';
		// 		const contentHtml = '<div class="notification-content">' + item.content + linkHtml + '</div></div>';
		// 		return titleHtml + contentHtml;
		// 	});
		// const notificationHtml =
		// 	notificationBlocksHtml +
		// 	'<div class="notification-footer"><button class="notification-confirm-button">OK</button>' +
		// 	'<div class="notification-show-me-again"><input type="checkbox" checked>Don\'t show me again</div></div></div>';
		// const notificationElement = document.createElement('div');
		// notificationElement.classList.add('github1s-notification');
		// notificationElement.innerHTML = notificationHtml;
		// document.body.appendChild(notificationElement);
		// notificationElement.querySelector('.notification-confirm-button').onclick = () => {
		// 	const notShowMeAgain = !!notificationElement.querySelector('.notification-show-me-again input').checked;
		// 	if (notShowMeAgain) {
		// 		window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, NOTIFICATION_STORAGE_VALUE);
		// 	}
		// 	document.body.removeChild(notificationElement);
		// };
	};
	/*** end notificaton block ***/

	window.vscodeWeb = {
		windowIndicator: {
			label: repository,
			// command: 'github1s.commands.openRepository',
		},
		additionalBuiltinExtensions: ['ms-vscode.anycode'],
		webviewEndpoint: staticAssetsPrefix + '/vscode/vs/workbench/contrib/webview/browser/pre',
		webWorkerExtensionHostIframeSrc:
			staticAssetsPrefix + '/vscode/vs/workbench/services/extensions/worker/httpWebWorkerExtensionHostIframe.html',
		commands: [
			{
				id: 'hyper-lambda.commands.vscode.getWindowObject',
				handler() {
					// Leaving this for reference.
					return window; // I was hoping that this would work, but it returns null
				},
			},
			{
				id: 'hyper-lambda.commands.vscode.getBrowserUrl',
				handler() {
					return window.location.href;
				},
			},
			{
				id: 'hyper-lambda.commands.vscode.getBrowserHash',
				handler() {
					return window.location.hash;
				},
			},
			{
				id: 'hyper-lambda.commands.vscode.getBrowserOrigin',
				handler() {
					return window.location.origin;
				},
			},
			{
				id: 'hyper-lambda.commands.vscode.getAdminSecret',
				handler() {
					let secret;
					try {
						secret = JSON.parse(window.localStorage.getItem('console:adminSecret') ?? '');
					} catch (error) {
						console.log('[Reading data from window]', error);
					}
					return secret;
				},
			},

			{
				id: 'hyper-lambda.commands.vscode.replaceBrowserUrl',
				handler(url) {
					window.history.replaceState(null, '', url);
				},
			},
			{
				id: 'hyper-lambda.commands.vscode.pushBrowserUrl',
				handler(url) {
					window.history.pushState(null, '', url);
				},
			},
		],
		productConfiguration: productConfiguration,
		initialColorTheme: { themeType: 'dark' },
		configurationDefaults: {
			'workbench.colorTheme': 'Default Dark+',
			'telemetry.telemetryLevel': 'off',
			'workbench.startupEditor': 'readme',
			'files.autoSave': 'off',
			'editor.defaultFormatter': 'esbenp.prettier-vscode',
			'editor.formatOnSave': true,
			'anycode.language.features': {
				completions: true,
				definitions: true,
				references: true,
				highlights: true,
				outline: true,
				workspaceSymbols: true,
				folding: true,
				diagnostics: true,
			},
		},
		builtinExtensions: window.hlambdaExtensions || [],
		// folderUri: { scheme: scheme, authority: '', path: '/' },
		// workspaceId: scheme + ':' + repository,
		workspaceLabel: workspaceLabel,
		hideTextFileLabelDecorations: true,
		logo: {
			icon: logoIcon,
			title: 'Open on ' + platformName,
			onClick() {
				window.open('https://hlambda.io', '_blank');
			},
		},
		onWorkbenchReady() {
			const loadSpinner = document.querySelector('#load-spinner');
			loadSpinner && loadSpinner.remove();
			renderNotification();
		},
	};
})();
