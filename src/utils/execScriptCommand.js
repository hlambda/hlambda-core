import path from 'path';
// import { exec, execSync } from 'child_process';
// import shellExec from 'shell-exec'; // Current version does not support custom cwd

import * as childProcess from 'child_process';

export const shellExec = (cmdInput, opts) => {
  const executable = Array.isArray(cmdInput) ? cmdInput.join(';') : cmdInput;
  const cwd = opts?.cwd ?? process.cwd();
  const options = {
    ...opts,
    stdio: 'pipe',
    cwd,
  };

  const { platform } = process;

  try {
    const cmd = platform === 'win32' ? 'cmd' : 'sh';
    const arg = platform === 'win32' ? '/C' : '-c';
    const child = childProcess.spawn(cmd, [arg, executable], options);

    return new Promise((resolve) => {
      const stdoutList = [];
      const stderrList = [];

      if (child.stdout) {
        child.stdout.on('data', (data) => {
          if (Buffer.isBuffer(data)) return stdoutList.push(data.toString());
          return stdoutList.push(data);
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          if (Buffer.isBuffer(data)) return stderrList.push(data.toString());
          return stderrList.push(JSON.stringify(data));
        });
      }

      const getDefaultResult = () => {
        const stderr = stderrList.join('\n');
        const stdout = stdoutList.join('\n');
        return { stdout, stderr, cmd: executable, cwd };
      };

      child.on('error', (error) => resolve({ ...getDefaultResult(), error }));
      child.on('close', (code) => resolve({ ...getDefaultResult(), code }));
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const execScriptCommand = async (command) => {
  const cwd = path.resolve('./metadata/');

  // console.log(shellExec.default);
  const data = await shellExec(command, { cwd })
    .then((dataObj) => {
      return dataObj;
    })
    .catch((error) => {
      console.log('[execScriptCommand]', error);
    });

  return data;
};

export default execScriptCommand;
