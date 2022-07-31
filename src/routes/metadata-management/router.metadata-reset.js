import express from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import rimraf from 'rimraf';
import fsPromise from 'fs/promises';
import fse from 'fs-extra';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.get(
  '/metadata/reset',
  asyncHandler(async (req, res) => {
    console.log(`Hlambda metadata reset call!`.red);
    // This action will reset metadata to the example preset already saved to the image. (Making life easier, but dangerous :))
    // We always need to ask user is he sure, does he really wants to remove existing metadata.
    console.log('Resetting metadata!');
    console.log('Removing all the metadata...');
    console.log('clearing path: rm -rf ', path.resolve(`${path.resolve(`./metadata/`)}/*`));
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
        console.error("[metadata-reset] ERROR: can't write ./data/metadata-history/last-metadata-clear-timestamp");
        console.error(error);
      });

    // This is still experimental so we will not use it.
    // fs.cp(src, dest, {recursive: true});

    await fse
      .copy(path.resolve(process.cwd(), './data/metadata-examples'), path.resolve(process.cwd(), './metadata'), {
        recursive: true,
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[metadata-reset] ERROR: can't copy example metadata");
        console.error(error);
      });

    res.send(`Hlambda metadata cleared to default example state!`);
  })
);

export default router;
