import express from 'express';
import asyncHandler from 'express-async-handler';

import path from 'path';
import fsPromise from 'fs/promises';
import { exec, execSync, spawn } from 'child_process';

// eslint-disable-next-line import/extensions
import { constants, getEnvValue } from '../../constants/index.js';

// Create express router
const router = express.Router();

/*
const getDataFromGit = async () => {
  const branchName = await Git.Repository.open(path.resolve(process.cwd()))
    .then((repositoryObj) => {
      return repositoryObj.getCurrentBranch();
    })
    .then((branchObj) => {
      return branchObj.shorthand();
    });

  const headCommitHash = await Git.Repository.open(path.resolve(process.cwd()))
    .then((repositoryObj) => {
      return repositoryObj.getHeadCommit();
    })
    .then((commitObj) => {
      return commitObj.sha();
    })
    .then((hash) => {
      return hash;
    });

  return {
    branchName,
    headCommitHash,
  };
};
*/

const executeShellCommand = async (command, args, inCwd) => {
  const cwd = typeof inCwd === 'undefined' ? path.resolve(process.cwd()) : path.resolve(inCwd);

  // This will work on any platform! As long as there is pm2
  const bat = spawn(command, args, {
    cwd,
    detached: true,
    stdio: ['ignore'],
  });

  bat.unref();

  // In PM2 process will hang because of monitoring, detach will not help you.
  // Node.js process in PM2 can't

  // // Hack to await stdout results or error
  // await new Promise((resolve) => {
  //   bat.stdout.on('data', (data) => {
  //     const result = data.toString();
  //     console.log(result);
  //     resolve(true);
  //   });

  //   bat.stderr.on('data', (data) => {
  //     const result = data.toString();
  //     console.error(result);
  //     resolve(true);
  //   });

  //   bat.on('exit', (/* code */) => {
  //     // console.info(`Child exited with code ${code}`);
  //     resolve(true);
  //   });

  //   bat.on('error', (error) => {
  //     console.error('Problem with spawning process, probably path is wrong.');
  //   });

  //   // It will resolve after 1.500 sec no mather what.
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 30000);
  // });
};

router.get(
  '/trigger-reload',
  asyncHandler(async (req, res) => {
    console.log(`Reload triggered!`);
    res.send(`Reload triggered!`);

    // Write file in data
    await fsPromise
      .writeFile(
        path.resolve(process.cwd(), './data/metadata-history/last-restarted-timestamp'),
        `${Date.now()}`,
        'utf8'
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[restart-microservice] ERROR: can't write ./data/metadata-history/last-restarted-timestamp");
        console.error(error);
      });

    // Call nginx reload
    // Maybe in the future if we want to do this with nginx instead of pm2

    // Call pm2 reload
    // executeShellCommand('pm2', ['reload', 'all']);

    // You can't reload if reloading unless you force it. (In future maybe we should ask client for additional confirmation for force)
    executeShellCommand('pm2', ['reload', 'all', '--force']);

    // // Write file in watch trigger
    // await fsPromise
    //   .writeFile(path.resolve(process.cwd(), './watcher_trigger/restarted.txt'), `${Date.now()}`, 'utf8')
    //   .then((data) => {
    //     return data;
    //   })
    //   .catch((error) => {
    //     console.error("[restart-microservice] ERROR: can't write ./watcher_trigger/restarted.txt");
    //     console.error(error);
    //   });
  })
);

export default router;
