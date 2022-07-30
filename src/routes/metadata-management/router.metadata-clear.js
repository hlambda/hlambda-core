import express from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import rimraf from 'rimraf';
import fsPromise from 'fs/promises';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.get(
  '/metadata/clear',
  asyncHandler(async (req, res) => {
    console.log(`Hlambda metadata import call!`.red);
    console.log('Removing all the metadata...'.red);
    console.log(`clearing path: rm -rf ${path.resolve(`${path.resolve(`./metadata/`)}/*`)}`.red);
    rimraf.sync(`${path.resolve(`./metadata/`)}/*`);

    // Write file in data
    await fsPromise
      .writeFile(
        path.resolve(process.cwd(), './data/metadata-history/last-metadata-clear-timestamp'),
        `${Date.now()}`,
        'utf8'
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[metadata-clear] ERROR: can't write ./data/metadata-history/last-metadata-clear-timestamp");
        console.error(error);
      });

    res.send(`Hlambda metadata cleared!`.green);
  })
);

export default router;
