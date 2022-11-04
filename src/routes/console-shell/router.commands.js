import express from 'express';
import asyncHandler from 'express-async-handler';

import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import util from 'util';

// Define errors
import errors from './../../errors/index.js';

// Create execPromise
const execPromise = util.promisify(exec);

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE

let workingDirectory = path.resolve('./metadata/');

/*
  Used to get current workingDirectory path.
  This should be deprecated because it is not stateless.
*/
router.get(
  '/command-cwd',
  asyncHandler(async (req, res) => {
    console.log('Warning: Depracated route - console: /command-cwd');
    res.json({
      data: workingDirectory,
      cwd: workingDirectory,
    });
  })
);

/*
  Used to change current workingDirectory path.
  This should be deprecated because it is not stateless.
*/
router.post(
  '/command-change-dir',
  asyncHandler(async (req, res) => {
    const inputPath = `${req?.body?.path}`;

    const candidate = path.resolve(workingDirectory, inputPath);
    if (fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory()) {
      workingDirectory = path.resolve(workingDirectory, inputPath);
    }

    res.json({
      data: workingDirectory,
      cwd: workingDirectory,
    });
  })
);

/*
  Used to check if the path is valid directory you can `cd` to. From current cwd.
  Terminal will call this so it can know if it can set new cwd locally.
*/
router.post(
  '/shell/check-change-dir',
  asyncHandler(async (req, res) => {
    const inputPath = `${req?.body?.path}`;
    const cwd = req?.body?.cwd ?? path.resolve('./metadata/');

    const candidate = path.resolve(cwd, inputPath);
    let validPath;
    let isValidCandidate = false;
    if (fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory()) {
      validPath = candidate;
      isValidCandidate = true;
    }

    res.json({
      validPath,
      isValidCandidate,
      cwd,
    });
  })
);

const executeCommandLegacy = async (req, res) => {
  const command = `${req?.body?.command}`;
  // If there is cwd set in command request we use that instead of the stateless one. (Stateless one should become legacy)
  const cwd = req?.body?.cwd ? `${req?.body?.cwd}` : path.resolve(workingDirectory);

  let data = 'Command error!';
  try {
    data = execSync(command, { cwd: path.resolve(cwd) });
    data = data.toString();
  } catch (error) {
    // console.log("output", error)
    console.log('sdterr', error.stderr.toString());
    data = error.stderr.toString();
  }

  res.json({
    data: data.toString(),
    cwd,
    cwdServerPointer: workingDirectory,
    // err,
    // stderr,
  });
};

router.post('/command-request', asyncHandler(executeCommandLegacy));

/*
  Stateless version of legacy command /command-request
*/

const executeCommand = async (req, res) => {
  const command = `${req?.body?.command}`;
  const cwd = req?.body?.cwd ?? path.resolve('./metadata/');

  let data = 'Command error!';
  try {
    const { stdout, stderr } = await execPromise(command, { cwd: path.resolve(cwd) });
    data = `${stdout}`;
    if (stderr) {
      data += `${stderr}`;
    }
  } catch (error) {
    // console.log("output", error)
    console.log('sdterr', `${error.stderr}`);
    data = `${error.stderr}`;
  }

  res.json({
    data: `${data}`,
    cwd,
    cwdServerPointer: workingDirectory,
    // err,
    // stderr,
  });
};
router.post('/shell/command-request', asyncHandler(executeCommand));

export default router;
