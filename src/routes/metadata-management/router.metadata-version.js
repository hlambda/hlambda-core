import express from 'express';
import asyncHandler from 'express-async-handler';

import path from 'path';
import fsp from 'fs/promises';
import { createHash } from 'crypto';

// Define errors
import errors from './../../errors/index.js';
import consoleOutputBuffer from './../../utils/loggerOverride.js';

// Create express router
const router = express.Router();

router.get(
  '/metadata/version',
  asyncHandler(async (req, res) => {
    const computeHashOfTheSingleFile = async (fullPath) => {
      const fileBuffer = await fsp.readFile(fullPath);
      const hashSum = createHash('sha256');
      hashSum.update(fileBuffer);
      return hashSum.digest('hex');
    };

    const computeMetaHash = async (folder, inputHash = null) => {
      const hash = inputHash || createHash('sha256');
      const info = await fsp.readdir(folder, { withFileTypes: true });
      // construct a string from the modification date, the filename and the filesize
      for (const item of info) {
        const fullPath = path.join(folder, item.name);
        if (item.isFile()) {
          // eslint-disable-next-line no-await-in-loop
          const statInfo = await fsp.stat(fullPath);
          const hashOfContent = computeHashOfTheSingleFile(fullPath);
          // compute hash string name:size:mtime
          // const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
          const fileInfo = `${fullPath}:${statInfo.size}:${hashOfContent}`;
          hash.update(fileInfo);
        } else if (item.isDirectory()) {
          // recursively walk sub-folders
          // eslint-disable-next-line no-await-in-loop
          await computeMetaHash(fullPath, hash);
        }
      }
      // if not being called recursively, get the digest and return it as the hash result
      if (!inputHash) {
        return hash.digest('hex');
      }
      return '';
    };

    const hash = await computeMetaHash(`${path.resolve(`./metadata/`)}`)
      .then((result) => {
        // console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
        return '-';
      });

    res.status(200).send(hash);
  })
);

export default router;
