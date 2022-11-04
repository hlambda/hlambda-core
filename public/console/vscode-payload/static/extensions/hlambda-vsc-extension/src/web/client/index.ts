const createAPIClient = (baseUrl: string, secret: string, authType = 'secret') => {
	/*
        Triggers server restart.
  	*/
	const restartServer = async (): Promise<string | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/trigger-restart`);
		const response = await fetch(`${baseUrl}/console/api/v1/trigger-restart`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	/*
        Triggers server reload (zero-downtime).
  	*/
	const reloadServer = async (): Promise<string | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/trigger-reload`);
		const response = await fetch(`${baseUrl}/console/api/v1/trigger-reload`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	/*
        Runs server command on the server, like `npm i hlambda` (Stateless, cwd required)
    */
	const runCommand = async (command: string, cwd = './'): Promise<{ data: string; cwd: string } | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/shell/command-request`);
		const response = await fetch(`${baseUrl}/console/api/v1/shell/command-request`, {
			method: 'POST',
			body: JSON.stringify({ command, cwd }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.json();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	const getCWD = async (
		path: string = './',
		cwd: string | undefined = undefined
	): Promise<{ isValidCandidate: boolean; validPath: string; cwd: string } | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/shell/check-change-dir`);
		const response = await fetch(`${baseUrl}/console/api/v1/shell/check-change-dir`, {
			method: 'POST',
			body: JSON.stringify({ path, cwd }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.json();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	/*
        Gets server version.
    */
	const getServerVersion = async (): Promise<string | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/version`);
		const response = await fetch(`${baseUrl}/console/api/v1/version`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	/*
        Gets the files and folders in the specific directory path.
    */
	const fileOrDirLookup = async (
		path: string,
		depth: number = 1
	): Promise<Array<{ name: string; type: 'file' | 'directory' }> | undefined> => {
		console.log(`${baseUrl}/console/api/v1/read-dir`);
		const response = await fetch(`${baseUrl}/console/api/v1/read-dir`, {
			method: 'POST',
			body: JSON.stringify({ path, depth }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.json();
		if (response.ok) {
			return resultRequestText;
		} else {
			console.log(resultRequestText);
		}
		return undefined;
	};

	/*
        Gets the files and folders in the specific directory path.
    */
	const readDirectory = async (
		path: string
	): Promise<Array<{ name: string; type: 'file' | 'directory' }> | undefined> => {
		console.log(`${baseUrl}/console/api/v1/read-dir`);
		const response = await fetch(`${baseUrl}/console/api/v1/read-dir`, {
			method: 'POST',
			body: JSON.stringify({ path }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.json();
		if (response.ok) {
			return resultRequestText;
		} else {
			console.log(resultRequestText);
		}
		return undefined;
	};

	/*
        Gets data of the specific file on the server.
    */
	const readFile = async (path: string) => {
		console.log(`${baseUrl}/console/api/v1/file-view`);
		const response = await fetch(`${baseUrl}/console/api/v1/file-view`, {
			method: 'POST',
			body: JSON.stringify({ path, encoding: 'base64' }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return undefined;
	};

	/*
        Deletes the data of the specific file on the server.
    */
	const deleteFile = async (path: string) => {
		console.log(`${baseUrl}/console/api/v1/file-delete`);
		const response = await fetch(`${baseUrl}/console/api/v1/file-delete`, {
			method: 'POST',
			body: JSON.stringify({ path }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return undefined;
	};

	/*
        Writes data of the specific file on the server.
    */
	const writeFile = async (path: string, content: Buffer) => {
		console.log(`${baseUrl}/console/api/v1/file-write`);
		const response = await fetch(`${baseUrl}/console/api/v1/file-edit`, {
			method: 'POST',
			body: JSON.stringify({ path, data: content.toString('base64'), encodingRead: 'utf-8', encodingWrite: 'base64' }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	/*
        Create specific directory on the server.
    */
	const createDirectory = async (path: string) => {
		console.log(`${baseUrl}/console/api/v1/create-directory`);
		const response = await fetch(`${baseUrl}/console/api/v1/create-directory`, {
			method: 'POST',
			body: JSON.stringify({ path }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		console.log('DEBUG:', resultRequestText);
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	/*
        Moves specific directory on the server.
    */
	const moveFilesAndDirectories = async (pathOld: string, pathNew: string) => {
		console.log(`${baseUrl}/console/api/v1/files-move`);
		const response = await fetch(`${baseUrl}/console/api/v1/files-move`, {
			method: 'POST',
			body: JSON.stringify({ pathOld, pathNew }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		console.log('DEBUG:', resultRequestText);
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	const getLogs = async () => {
		console.log(`${baseUrl}/console/api/v1/logs?type=text`);
		const response = await fetch(`${baseUrl}/console/api/v1/logs?type=text`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	const getConstants = async () => {
		console.log(`${baseUrl}/console/api/v1/constants`);
		const response = await fetch(`${baseUrl}/console/api/v1/constants`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	const getEnvironments = async () => {
		console.log(`${baseUrl}/console/api/v1/environments`);
		const response = await fetch(`${baseUrl}/console/api/v1/environments`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}

		return '';
	};

	const customCall = async (url: string) => {
		const response = await fetch(`${baseUrl}${url}`, {
			headers: {
				Accept: 'application/json',
				'X-Hlambda-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			console.log(resultRequestText);
		}

		return resultRequestText;
	};

	return {
		restartServer,
		reloadServer,
		getServerVersion,
		runCommand,
		getCWD,
		fileOrDirLookup,
		readFile,
		writeFile,
		deleteFile,
		createDirectory,
		moveFilesAndDirectories,
		readDirectory,
		getLogs,
		getConstants,
		getEnvironments,
		customCall,
	};
};

export default createAPIClient;
