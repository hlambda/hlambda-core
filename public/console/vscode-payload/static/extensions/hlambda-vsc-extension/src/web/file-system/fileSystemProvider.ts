import * as vscode from 'vscode';
import * as path from 'path';
import { Buffer } from 'buffer';

import createAPIClient from './../client';

export const trimStart = (str: string, chars: string = ' '): string => {
	let index = 0;
	while (chars.indexOf(str[index]) !== -1) {
		index++;
	}
	return str.slice(index);
};

export const joinPath = (...segments: string[]): string => {
	const validSegments = segments.filter(Boolean);
	if (!validSegments.length) {
		return '';
	}
	return validSegments.reduce((prev, segment) => {
		return trimEnd(prev, '/') + '/' + trimStart(segment, '/');
	});
};

export const trimEnd = (str: string, chars: string = ' '): string => {
	let length = str.length;
	while (length && chars.indexOf(str[length - 1]) !== -1) {
		length--;
	}
	return str.slice(0, length);
};

export const dirname = (path: string): string => {
	const trimmedPath = trimEnd(path, '/');
	return trimmedPath.substr(0, trimmedPath.lastIndexOf('/')) || '';
};

export const basename = (path: string): string => {
	const trimmedPath = trimEnd(path, '/');
	return trimmedPath.substr(trimmedPath.lastIndexOf('/') + 1) || '';
};

const FILE_COUNT_LIMIT = 50000;

// ================================================================================
/*
    File Class
*/
export class File implements vscode.FileStat {
	type: vscode.FileType;
	ctime: number;
	mtime: number;
	size: number;

	name: string;
	sha: string;
	data?: Uint8Array;
	permissions: number;

	constructor(public uri: vscode.Uri, name: string, options?: any, ctime?: number, mtime?: number, size?: number) {
		this.type = vscode.FileType.File;
		this.ctime = ctime || Date.now();
		this.mtime = mtime || Date.now();
		this.size = size || 0;
		this.name = name;
		this.sha = options && 'sha' in options ? options.sha : '';
		this.size = options && 'size' in options ? options.size : 0;
		this.permissions = 0;
	}
}

/*
    Directory Class
*/
export class Directory implements vscode.FileStat {
	type: vscode.FileType;
	ctime: number;
	mtime: number;
	size: number;

	name: string;
	entries: Map<string, File | Directory>;
	sha: string;

	constructor(public uri: vscode.Uri, name: string, options?: any, ctime?: number, mtime?: number, size?: number) {
		this.type = vscode.FileType.Directory;
		this.ctime = ctime || Date.now();
		this.mtime = mtime || Date.now();
		this.size = size || 0;
		this.name = name;
		this.sha = options && 'sha' in options ? options.sha : '';
		this.entries = new Map();
	}

	getNameTypePairs(): [string, vscode.FileType][] {
		return Array.from(this.entries?.entries() || []).map(([name, item]: [string, Entry]) => [
			name,
			item instanceof Directory ? vscode.FileType.Directory : vscode.FileType.File,
		]);
	}
}

export type Entry = File | Directory;
export type DirectoryEntry =
	| { type: vscode.FileType.Directory; path: string } // for director or link
	| { type: vscode.FileType.File; path: string; size?: number }; // for a file

// ================================================================================
export class RemoteRESTFS implements vscode.FileSystemProvider {
	private static instance: RemoteRESTFS | null = null;
	private readonly disposable: vscode.Disposable | undefined;
	public clientAPI;
	// --------------------------------------------------------------------------------
	constructor(url: string, adminSecret: string) {
		this.clientAPI = createAPIClient(url, adminSecret);
	}

	// public static getInstance(): RemoteRESTFS {
	//   if (RemoteRESTFS.instance) {
	//     return RemoteRESTFS.instance;
	//   }
	//   return (RemoteRESTFS.instance = new RemoteRESTFS());
	// }

	dispose() {
		this.disposable?.dispose();
	}
	// --------------------------------------------------------------------------------
	// private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	// private pathRoot: Map<string, Directory | File> = new Map();
	// private contentCache: Map<string, Uint8Array> = new Map();

	// Stat will return based on uri lookup from uri
	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		console.log('[fileSystemProvider] EVENT: stat');
		const fileName1 = path.posix.basename(uri.path);
		const fileDirname1 = uri.with({ path: path.posix.dirname(uri.path) });

		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		const fileName = basename(prefixedPathWithRoot);
		const fileDirname = dirname(prefixedPathWithRoot);
		console.log('prefixedPathWithRoot:', prefixedPathWithRoot);
		console.log('fileName:', fileName, fileName1);
		console.log('fileDirname:', fileDirname, fileDirname1);

		// const getFileContents = await clientAPI.readFile(prefixedPathWithRoot)
		//     .then((data: any) => { return data; })
		//     .catch((error: any) => { console.error(error) });

		// if (getFileContents) {
		//     new File(uri, 'random')
		// }

		const filesInDirectory = await clientAPI
			.readDirectory(fileDirname)
			.then((dataDir: any) => {
				console.log('[hlambda-extension] Result:', dataDir);
				if (Array.isArray(dataDir)) {
					return dataDir;
				} else {
					console.error('[hlambda-extension] Error: Getting results from root dir did not return json array.');
				}
			})
			.catch((error: any) => {
				console.log(error);
			});

		if (typeof filesInDirectory === 'undefined') {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		// Check if we are in root, if so we need to return the file type directory
		if (fileName === '.') {
			return new Directory(uri, '');
		}

		let file = filesInDirectory.find(
			(o: { name: string; type: string; ctime?: number; mtime?: number; size?: number }) => {
				// console.log('find:', o.name, o.type,'----' , fileName);
				return o.name === fileName;
			}
		);

		// console.log('file:', file, fileName);

		if (typeof file === 'undefined') {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		return file.type === 'file'
			? new File(uri, file.name, undefined, file.ctime, file.mtime, file.size)
			: new Directory(uri, file.name, undefined, file.ctime, file.mtime, file.size);
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		console.log('[fileSystemProvider] EVENT: readDirectory');

		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		console.log('prefixedPathWithRoot:', prefixedPathWithRoot);

		const directories: Array<any> = await clientAPI
			.readDirectory(prefixedPathWithRoot)
			.then((dataDir: any) => {
				console.log('[hlambda-extension] Result:', dataDir);
				if (Array.isArray(dataDir)) {
					const spec = (dataDir ?? []).map((item: any) => {
						let intType = 0;
						if (item.type === 'file') {
							intType = 1;
						} else {
							intType = 2;
						}
						return [item.name, intType];
					}); // TODO: Transform and define this type
					console.log('[hlambda-extension] spec:', spec);
					return spec;
				} else {
					console.error('[hlambda-extension] Error: Getting results from root dir did not return json array.');
					return [];
				}
			})
			.catch((error: any) => {
				console.log(error);
				return [];
			});

		return directories;

		return Array(10 + 1)
			.join('-')
			.split('-')
			.map((item) => [
				'test-file-' + Date.now(),
				Date.now() % 2 === 0 ? vscode.FileType.Directory : vscode.FileType.File,
			]);
	}

	// --- manage file contents

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		console.log('[fileSystemProvider] EVENT: readFile');
		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;

		const getFileContents = await clientAPI
			.readFile(prefixedPathWithRoot)
			.then((data: any) => {
				// console.log(data);
				return data;
			})
			.catch((error: any) => {
				console.error(error);
			});

		if (getFileContents) {
			return Buffer.from(getFileContents, 'base64');
		}
		return Buffer.from('');
		// throw vscode.FileSystemError.FileNotFound();
	}

	async writeFile(
		uri: vscode.Uri,
		content: Uint8Array,
		options: { create: boolean; overwrite: boolean }
	): Promise<void> {
		console.log('[fileSystemProvider] EVENT: writeFile');
		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;

		const fileWriteResult = await clientAPI
			.writeFile(prefixedPathWithRoot, Buffer.from(content))
			.then((data: any) => {
				console.log(data);
				return data;
			})
			.catch((error: any) => {
				console.error(error);
			});

		console.log(fileWriteResult);

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
	}

	// --- manage files/folders

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		console.log('[fileSystemProvider] EVENT: rename');
		const clientAPI = this.clientAPI;

		const dirnameOldUri = oldUri.with({ path: path.posix.dirname(oldUri.path) });
		const basenameOldUri = path.posix.basename(oldUri.path);
		const dirnameNewUri = newUri.with({ path: path.posix.dirname(newUri.path) });
		const basenameNewUri = path.posix.basename(newUri.path);

		// Move
		const myPath = oldUri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		const myNewPath = newUri.path;
		const prefixedNewPathWithRoot = myNewPath.startsWith('/') ? `.${myNewPath}` : `./${myNewPath}`;

		const getMoveResult = await clientAPI
			.moveFilesAndDirectories(prefixedPathWithRoot, prefixedNewPathWithRoot)
			.then((data: any) => {
				return data;
			})
			.catch((error: any) => {
				console.error(error);
			});

		// // Read old
		// const myPath = oldUri.path;
		// const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		// const getFileContents = await clientAPI
		// 	.readFile(prefixedPathWithRoot)
		// 	.then((data: any) => {
		// 		return data;
		// 	})
		// 	.catch((error: any) => {
		// 		console.error(error);
		// 	});

		// // Write new
		// const myNewPath = newUri.path;
		// const prefixedNewPathWithRoot = myNewPath.startsWith('/') ? `.${myNewPath}` : `./${myNewPath}`;
		// const fileWriteResult = await clientAPI
		// 	.writeFile(prefixedNewPathWithRoot, Buffer.from(getFileContents))
		// 	.then((data: any) => {
		// 		return data;
		// 	})
		// 	.catch((error: any) => {
		// 		console.error(error);
		// 	});

		// console.log(fileWriteResult);

		// // Delete old
		// const fileDeleteResult = await clientAPI
		// 	.deleteFile(prefixedPathWithRoot)
		// 	.then((data: any) => {
		// 		return data;
		// 	})
		// 	.catch((error: any) => {
		// 		console.error(error);
		// 	});

		// console.log(fileDeleteResult);

		this._fireSoon(
			{ type: vscode.FileChangeType.Deleted, uri: oldUri },
			{ type: vscode.FileChangeType.Created, uri: newUri }
		);
	}

	async delete(uri: vscode.Uri): Promise<void> {
		console.log('[fileSystemProvider] EVENT: delete');
		const dirname = uri.with({ path: path.posix.dirname(uri.path) });
		const basename = path.posix.basename(uri.path);
		console.log('basename', basename);
		console.log('dirname', dirname);

		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		console.log('delete', prefixedPathWithRoot);

		const fileDeleteResult = await clientAPI
			.deleteFile(prefixedPathWithRoot)
			.then((data: any) => {
				return data;
			})
			.catch((error: any) => {
				console.error(error);
			});

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { uri, type: vscode.FileChangeType.Deleted });
	}

	// async createFile(uri: vscode.Uri): Promise<void> {
	//     console.log('[fileSystemProvider] EVENT: createFile');
	//     const basename = path.posix.basename(uri.path);
	//     const dirname = uri.with({ path: path.posix.dirname(uri.path) });
	//     console.log('basename', basename);
	//     console.log('dirname', dirname);
	//     // const parent = this._lookupAsDirectory(dirname, false);

	//     const entry = new File(dirname, basename);
	//     // parent.entries.set(entry.name, entry);
	//     // parent.mtime = Date.now();
	//     // parent.size += 1;
	//     this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
	// }

	/*
        Create directory, should call create-directory on file API of the Hlambda
    */
	async createDirectory(uri: vscode.Uri): Promise<void> {
		console.log('[fileSystemProvider] EVENT: createDirectory');
		const basename = path.posix.basename(uri.path);
		const dirname = uri.with({ path: path.posix.dirname(uri.path) });
		console.log('basename', basename);
		console.log('dirname', dirname);

		const clientAPI = this.clientAPI;

		const myPath = uri.path;
		const prefixedPathWithRoot = myPath.startsWith('/') ? `.${myPath}` : `./${myPath}`;
		console.log('wwwww', prefixedPathWithRoot);

		const fileWriteResult = await clientAPI
			.createDirectory(prefixedPathWithRoot)
			.then((data: any) => {
				console.log(data);
				return data;
			})
			.catch((error: any) => {
				console.error(error);
			});

		console.log(fileWriteResult);

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
	}

	// --- manage file events

	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	private _bufferedEvents: vscode.FileChangeEvent[] = [];
	private _fireSoonHandle?: NodeJS.Timer;

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => {});
	}

	private _fireSoon(...events: vscode.FileChangeEvent[]): void {
		this._bufferedEvents.push(...events);

		if (this._fireSoonHandle) {
			clearTimeout(this._fireSoonHandle);
		}

		this._fireSoonHandle = setTimeout(() => {
			this._emitter.fire(this._bufferedEvents);
			this._bufferedEvents.length = 0;
		}, 5);
	}
}
