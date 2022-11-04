import * as vscode from 'vscode';

import createAPIClient from './../client';

const splice = (originalString: string, idx: number, rem: number, insertString: string) => {
	return originalString.slice(0, idx === 0 ? 0 : idx) + insertString + originalString.slice(idx + Math.abs(rem));
};

export class RemoteRESTTerminal {
	private static instance: RemoteRESTTerminal | null = null;
	private readonly disposable: vscode.Disposable | undefined;
	public clientAPI;
	public writeEmitter = new vscode.EventEmitter<string>();
	public pty;
	public content;
	public defaultLine;
	public keys;
	public actions;
	public cwd: string = './metadata/'; // By default we want to be here
	public url: string = '';
	public history: string[] = ['']; // Important to have no command ''
	public historyIndex: number = 0;
	public pointerIndex: number = 0; // Location of the pointer in content
	public debug: boolean = false;
	// --------------------------------------------------------------------------------
	private formatText = (text: string) => `\r${text.split(/(\r?\n)/g).join('\r')}\r`;
	// --------------------------------------------------------------------------------
	constructor(url: string, adminSecret: string, showTerminal: boolean = false) {
		this.url = url;
		this.defaultLine = ''; // '→ ';
		this.keys = {
			enter: '\r',
			tab: '\t',
			backspace: '\x7f',
			leftArrow: '\x1b[D',
			rightArrow: '\x1b[C',
			upArrow: '\x1b[A',
			downArrow: '\x1b[B',
		};
		this.actions = {
			cursorBack: '\x1b[D',
			deleteChar: '\x1b[P',
			insertChar: '\x1b[1@',
			clear: '\x1b[2J\x1b[3J\x1b[;H',
			clearLine: '\x1b[2K\r', // \r is important
		};
		this.content = this.defaultLine;

		this.clientAPI = createAPIClient(url, adminSecret);
		this.pty = {
			onDidWrite: this.writeEmitter.event,
			open: async () => {
				// Get the cwd from start and log it into our internal cwd.
				const resultCWD = await this.clientAPI.getCWD('./');
				this.debug && console.log('cwd', resultCWD?.validPath);
				this.cwd = resultCWD?.validPath ?? '';

				this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
			},
			close: () => {},
			handleInput: async (chars: string) => {
				switch (chars) {
					case this.keys.tab:
						return;
					case this.keys.enter:
						// preserve the run command line for history
						this.writeEmitter.fire(`\r${this.content}\r\n`);
						// trim off leading default prompt
						const command = this.content.slice(this.defaultLine.length);

						try {
							// run the command
							console.log('EXECUTING:', command);

							if (command === '') {
								this.content = '';
								this.writeEmitter.fire(this.actions.clear);
								this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							this.history.push(command);
							this.historyIndex = this.history.length - 1; // Set index to the last item in history

							// Check for special cases
							if (['clear', 'cls', 'exit', 'quit'].includes(command.toLowerCase())) {
								this.content = '';
								this.writeEmitter.fire(this.actions.clear);
								this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							if (['reload'].includes(command.toLowerCase())) {
								const result = await this.clientAPI.reloadServer();
								console.log(result);
								this.content = '';
								this.writeEmitter.fire(`Hλ ${this.url} | Server reload triggered!\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							if (['restart'].includes(command.toLowerCase())) {
								const result = await this.clientAPI.restartServer();
								console.log(result);
								this.content = '';
								this.writeEmitter.fire(`Hλ ${this.url} | Server restart triggered!\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							if (['history'].includes(command.toLowerCase())) {
								this.content = '';
								this.writeEmitter.fire(this.history.join('\n\r'));
								this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							if (['history clear'].includes(command.toLowerCase())) {
								this.content = '';
								this.history = [];
								this.writeEmitter.fire(this.history.join('\n\r'));
								this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
								this.historyIndex = 0;
								this.pointerIndex = 0;
								return;
							}

							// Check for cd
							if (command.toLowerCase().startsWith('cd')) {
								const t = command.match(/cd\s(.+)/);
								// Check for candidate
								if (t && t[1]) {
									const results = await this.clientAPI.getCWD(t[1], this.cwd);
									if (results?.validPath && results?.isValidCandidate) {
										this.cwd = results?.validPath;
									}
								}
							} else {
								console.log('cwd', this.cwd);

								const result = await this.clientAPI.runCommand(command, this.cwd);

								const stdout: string = result?.data ?? '';
								const stderr: any = undefined;

								console.log('stdout');
								console.log(stdout);

								if (stdout) {
									this.writeEmitter.fire(this.formatText(stdout));
									// this.writeEmitter.fire(stdout);
								}

								if (stderr && stderr.length) {
									this.writeEmitter.fire(stderr);
								}
							}
						} catch (error: any) {
							this.writeEmitter.fire(`\r${error?.message ?? ''}`);
						}
						// Important this cleans up the content.
						this.content = this.defaultLine;
						this.writeEmitter.fire(`\n\rHλ ${this.url} | ${this.cwd} #\n\r`);
						this.historyIndex = 0;
						this.pointerIndex = 0;
					case this.keys.backspace:
						if (this.content.length <= 0) {
							return;
						}
						if (this.pointerIndex <= 0) {
							return;
						}

						// remove last character
						// this.content = this.content.substr(0, this.content.length - 1);
						this.debug && console.log('new content before backspace:', this.content, this.pointerIndex);
						this.content = splice(this.content, this.pointerIndex - 1, 1, '');
						this.pointerIndex -= 1;
						this.debug && console.log('new content after backspace:', this.content, this.pointerIndex);

						this.writeEmitter.fire(this.actions.cursorBack);
						this.writeEmitter.fire(this.actions.deleteChar);
						return;
					case this.keys.upArrow:
						// Write history
						this.historyIndex = (this.history.length + (this.historyIndex - 1)) % this.history.length;
						this.content = this.history[this.historyIndex];
						this.writeEmitter.fire(this.actions.clearLine);
						this.writeEmitter.fire(this.content);
						this.pointerIndex = this.content.length;
						return;
					case this.keys.downArrow:
						// Write history
						this.historyIndex = (this.historyIndex + 1) % this.history.length;
						this.content = this.history[this.historyIndex];
						this.writeEmitter.fire(this.actions.clearLine);
						this.writeEmitter.fire(this.content);
						this.pointerIndex = this.content.length;
						return;
					case this.keys.leftArrow:
						if (this.pointerIndex > 0) {
							this.pointerIndex -= 1;
							this.writeEmitter.fire(chars); // Only emit but do not paste char, and change pointer index.
						}
						this.debug && console.log('index at', this.pointerIndex);
						return;
					case this.keys.rightArrow:
						if (this.pointerIndex < this.content.length) {
							this.pointerIndex += 1;
							this.writeEmitter.fire(chars); // Only emit but do not paste char, and change pointer index.
						}
						this.debug && console.log('index at', this.pointerIndex);
						return;
					default: // Instead of writing to the end write at the index.
						// This will help if user paste
						// Consider that char can be a paste, and can contain multiple chars

						// TODO: Note: There is a possible issue if someone pastes special characters, what should we do. (never tested it, maybe it is not even the issue)

						// Typing a new character
						this.debug && console.log('typed char', chars, 'at index', this.pointerIndex);
						this.content = splice(this.content, this.pointerIndex, 0, chars);
						this.debug && console.log('new content:', this.content);
						this.pointerIndex += chars.length;

						//this.writeEmitter.fire(this.actions.insertChar); // Ultra important
						this.writeEmitter.fire(`\x1b[${chars.length}@`);
						this.writeEmitter.fire(chars);
				}
			},
		};

		// Create new terminal
		const terminal = vscode.window.createTerminal({
			name: `Pseudo Terminal - Hlambda server ${this.url}`,
			pty: this.pty,
		});
		// vscode.window.showInformationMessage('Terminal successfuly created');

		if (showTerminal) {
			terminal.show();
		} else {
			// terminal.hide();
		}
	}

	dispose() {
		this.disposable?.dispose();
	}
	// --------------------------------------------------------------------------------
	async stat(uri: vscode.Uri) {}
}

export function activateTerminal(context: vscode.ExtensionContext) {
	let NEXT_TERM_ID = 1;

	console.log('Terminals: ' + (<any>vscode.window).terminals.length);

	// vscode.window.onDidOpenTerminal
	vscode.window.onDidOpenTerminal((terminal) => {
		console.log('Terminal opened. Total count: ' + (<any>vscode.window).terminals.length);
	});

	// vscode.window.onDidChangeActiveTerminal
	vscode.window.onDidChangeActiveTerminal((e) => {
		console.log(`Active terminal changed, name=${e ? e.name : 'undefined'}`);
	});

	// vscode.window.createTerminal
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.createTerminal', () => {
			vscode.window.createTerminal({ name: `Ext Terminal #${NEXT_TERM_ID++}` });
			vscode.window.showInformationMessage('Hello World 2!');
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.createTerminalHideFromUser', () => {
			vscode.window.createTerminal({
				name: `Ext Terminal #${NEXT_TERM_ID++}`,
				hideFromUser: true,
			} as any);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.createAndSend', () => {
			const terminal = vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`);
			terminal.sendText("echo 'Sent text immediately after creating'");
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.createZshLoginShell', () => {
			vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`, '/bin/zsh', ['-l']);
		})
	);

	// Terminal.hide
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.hide', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.hide();
					}
				});
			}
		})
	);

	// Terminal.show
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.show', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.show();
					}
				});
			}
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.showPreserveFocus', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.show(true);
					}
				});
			}
		})
	);

	// Terminal.sendText
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.sendText', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.sendText("echo 'Hello world!'");
					}
				});
			}
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.sendTextNoNewLine', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.sendText("echo 'Hello world!'", false);
					}
				});
			}
		})
	);

	// Terminal.dispose
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.dispose', () => {
			if (ensureTerminalExists()) {
				selectTerminal().then((terminal) => {
					if (terminal) {
						terminal.dispose();
					}
				});
			}
		})
	);

	// Terminal.processId
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.processId', () => {
			selectTerminal().then((terminal) => {
				if (!terminal) {
					return;
				}
				terminal.processId.then((processId) => {
					if (processId) {
						vscode.window.showInformationMessage(`Terminal.processId: ${processId}`);
					} else {
						vscode.window.showInformationMessage('Terminal does not have a process ID');
					}
				});
			});
		})
	);

	// vscode.window.onDidCloseTerminal
	vscode.window.onDidCloseTerminal((terminal) => {
		vscode.window.showInformationMessage(`onDidCloseTerminal, name: ${terminal.name}`);
	});

	// vscode.window.terminals
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.terminals', () => {
			selectTerminal();
		})
	);

	// ExtensionContext.environmentVariableCollection
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.updateEnvironment', () => {
			const collection = context.environmentVariableCollection;
			collection.replace('FOO', 'BAR');
			collection.append('PATH', '/test/path');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.clearEnvironment', () => {
			context.environmentVariableCollection.clear();
		})
	);

	// vvv Proposed APIs below vvv

	// vscode.window.onDidWriteTerminalData
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.onDidWriteTerminalData', () => {
			(<any>vscode.window).onDidWriteTerminalData((e: any) => {
				vscode.window.showInformationMessage(
					`onDidWriteTerminalData listener attached, check the devtools console to see events`
				);
				console.log('onDidWriteData', e);
			});
		})
	);

	// vscode.window.onDidChangeTerminalDimensions
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.onDidChangeTerminalDimensions', () => {
			vscode.window.showInformationMessage(
				`Listening to onDidChangeTerminalDimensions, check the devtools console to see events`
			);
			(<any>vscode.window).onDidChangeTerminalDimensions((event: any) => {
				console.log(
					`onDidChangeTerminalDimensions: terminal:${event.terminal.name}, columns=${event.dimensions.columns}, rows=${event.dimensions.rows}`
				);
			});
		})
	);

	// vscode.window.registerTerminalLinkProvider
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalHyperLambdaWeb.registerTerminalLinkProvider', () => {
			(<any>vscode.window).registerTerminalLinkProvider({
				provideTerminalLinks: (context: any, token: vscode.CancellationToken) => {
					// Detect the first instance of the word "link" if it exists and linkify it
					const startIndex = (context.line as string).indexOf('link');
					if (startIndex === -1) {
						return [];
					}
					return [
						{
							startIndex,
							length: 'link'.length,
							tooltip: 'Show a notification',
							// You can return data in this object to access inside handleTerminalLink
							data: 'Example data',
						},
					];
				},
				handleTerminalLink: (link: any) => {
					vscode.window.showInformationMessage(`Link activated (data = ${link.data})`);
				},
			});
		})
	);

	context.subscriptions.push(
		vscode.window.registerTerminalProfileProvider('terminalHyperLambdaWeb.terminal-profile', {
			provideTerminalProfile(token: vscode.CancellationToken): vscode.ProviderResult<vscode.TerminalProfile> {
				return {
					options: {
						name: 'Terminal API',
						shellPath: process.title || 'C:/Windows/System32/cmd.exe',
					},
				};
			},
		})
	);
}

function colorText(text: string): string {
	let output = '';
	let colorIndex = 1;
	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		if (char === ' ' || char === '\r' || char === '\n') {
			output += char;
		} else {
			output += `\x1b[3${colorIndex++}m${text.charAt(i)}\x1b[0m`;
			if (colorIndex > 6) {
				colorIndex = 1;
			}
		}
	}
	return output;
}

function selectTerminal(): Thenable<vscode.Terminal | undefined> {
	interface TerminalQuickPickItem extends vscode.QuickPickItem {
		terminal: vscode.Terminal;
	}
	const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
	const items: TerminalQuickPickItem[] = terminals.map((t) => {
		return {
			label: `name: ${t.name}`,
			terminal: t,
		};
	});
	return vscode.window.showQuickPick(items).then((item) => {
		return item ? item.terminal : undefined;
	});
}

function ensureTerminalExists(): boolean {
	if ((<any>vscode.window).terminals.length === 0) {
		vscode.window.showErrorMessage('No active terminals');
		return false;
	}
	return true;
}
