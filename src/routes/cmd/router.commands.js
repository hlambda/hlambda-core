import express from 'express';
import asyncHandler from 'express-async-handler';

import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE

let workingDirectory = path.resolve('./metadata/');

router.get(
  '/command-cwd',
  asyncHandler(async (req, res) => {
    res.json({
      data: workingDirectory,
      cwd: workingDirectory,
    });
  })
);

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

router.post(
  '/command-request',
  asyncHandler(async (req, res) => {
    const command = `${req?.body?.command}`;

    let data = 'Command error!';
    try {
      data = execSync(command, { cwd: path.resolve(workingDirectory) });
      data = data.toString();
    } catch (error) {
      // console.log("output", error)
      console.log('sdterr', error.stderr.toString());
      data = error.stderr.toString();
    }

    res.json({
      data: data.toString(),
      cwd: workingDirectory,
      // err,
      // stderr,
    });
  })
);

export default router;
