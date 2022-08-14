import express from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import multer from 'multer';
import AdmZip from 'adm-zip';
import rimraf from 'rimraf';
import fsPromise from 'fs/promises';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.post(
  '/console/update',
  asyncHandler(async (req, res) => {
    console.log(`Hlambda Console UI update event triggered!`.yellow);

    console.log('Removing Hλ Console UI files...');
    console.log('clearing path: rm -rf ', path.resolve(`${path.resolve(`./public/console/`)}/*`));
    rimraf.sync(`${path.resolve(`./public/console/`)}/*`);

    zip.extractAllTo(path.resolve('./public/console/'), true);

    console.log('Done...');

    // Write file in data
    await fsPromise
      .writeFile(
        path.resolve(process.cwd(), './data/self-update-history/last-console-update-timestamp'),
        `${Date.now()}`,
        'utf8'
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[metadata-import] ERROR: can't write ./data/self-update-history/last-console-update-timestamp");
        console.error(error);
      });

    res.send(`Hλ Console UI updated!`);
  })
);

export default router;
