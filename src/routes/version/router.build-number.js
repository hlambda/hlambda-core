import express from 'express';
import asyncHandler from 'express-async-handler';

import { readFile } from 'fs/promises';
import path from 'path';

// Define errors
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

router.get(
  '/build-version',
  asyncHandler(async (req, res) => {
    const getBuildVersion = await readFile('./image-build-timestamp.txt', 'utf8')
      .then((fileData) => {
        return fileData;
      })
      .catch((error) => {
        return 'hotbuild';
      });
    res.status(200).send(getBuildVersion);
  })
);

export default router;
