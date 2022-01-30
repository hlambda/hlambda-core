import express from 'express';
import asyncHandler from 'express-async-handler';

import fs from 'fs';
import path from 'path';
import { readFile, writeFile, readdir } from 'fs/promises';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak source

// Serve static
router.use('/files', express.static('metadata'));

router.post(
  '/read-dir',
  asyncHandler(async (req, res) => {
    const inputPath = req?.body?.path;

    // console.log(path.resolve('./', inputPath));

    const fileData = await readdir(path.resolve('./', inputPath))
      .then((data) => {
        // console.log('File read successfull!'.green);
        return data;
      })
      .catch(() => {
        console.log('Directory read failed!'.red);
        return [];
      });

    const remap = fileData.map((item) => {
      const candidate = path.resolve('./', inputPath, item);
      // console.log(candidate);
      return {
        name: item,
        type: fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory() ? 'directory' : 'file',
      };
    });

    res.send(remap);
  })
);

router.post(
  '/file-view',
  asyncHandler(async (req, res) => {
    const inputPath = req?.body?.path;
    const encoding = req?.body?.encoding ?? 'utf-8';

    const fileData = await readFile(inputPath, encoding)
      .then((data) => {
        // console.log('File read successfull!'.green);
        return data;
      })
      .catch(() => {
        console.log(`File read ${inputPath} failed!`.red);
      });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(fileData);
  })
);

router.post(
  '/file-edit',
  asyncHandler(async (req, res) => {
    const inputPath = req?.body?.path;
    const data = req?.body?.data;
    const encodingWrite = req?.body?.encodingWrite ?? 'base64';
    const encodingRead = req?.body?.encodingRead ?? 'utf-8';

    await writeFile(inputPath, data, encodingWrite)
      .then(() => {
        console.log(`File write ${inputPath} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${inputPath} failed`.red);
      });

    const fileDataAfterWrite = await readFile(inputPath, encodingRead)
      .then((fileReadData) => {
        // console.log('File read successfull!'.green);
        return fileReadData;
      })
      .catch(() => {
        console.log('File read after write failed!'.red);
      });

    res.send(fileDataAfterWrite);
  })
);

export default router;
