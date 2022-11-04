import express from 'express';
import asyncHandler from 'express-async-handler';

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { readFile, writeFile, readdir, mkdir } from 'fs/promises';

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
        // console.log(inputPath);
        // console.log(path.resolve('./', inputPath));
        // console.log('Directory read failed!'.red);
        return [];
      });

    const remap = fileData.map((item) => {
      const candidate = path.resolve('./', inputPath, item);
      const itExists = fs.existsSync(candidate);
      const lstat = fs.lstatSync(candidate);
      // console.log(candidate);
      return {
        name: item,
        type: itExists && lstat.isDirectory() ? 'directory' : 'file',
        ...lstat,
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
        // This is often seen as unnecessary error message, thus for now we are silencing it
        // console.log(`File read ${inputPath} failed!`.red);
      });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(fileData);
  })
);

// Set payload size to 10 MB for this route
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

router.post(
  '/create-directory',
  asyncHandler(async (req, res) => {
    const inputPath = req?.body?.path;

    const result = await mkdir(inputPath, { recursive: true });

    res.send(result);
  })
);

router.post(
  '/files-move',
  asyncHandler(async (req, res) => {
    const inputPathOld = req?.body?.pathOld;
    const inputPathNew = req?.body?.pathNew;

    await fse
      .move(path.resolve(process.cwd(), inputPathOld), path.resolve(process.cwd(), inputPathNew), {
        recursive: true,
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[metadata-reset] ERROR: can't move");
        console.error(error);
      });

    res.send('moved');
  })
);

export default router;
