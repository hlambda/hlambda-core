import express from 'express';
import asyncHandler from 'express-async-handler';

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { readFile, writeFile, readdir } from 'fs/promises';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak source

router.post(
  '/file-delete',
  asyncHandler(async (req, res) => {
    const inputPath = req?.body?.path;

    console.log(`Clearing path: rm -rf ${path.resolve(`${path.resolve(inputPath)}`)}`.red);
    rimraf.sync(`${path.resolve(inputPath)}`);

    res.send('File or directory deleted!');
  })
);

export default router;
