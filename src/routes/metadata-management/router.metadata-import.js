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

const upload = multer({
  /* dest: 'uploads/' */
});

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.post(
  '/metadata/import',
  upload.single('metadata'),
  asyncHandler(async (req, res) => {
    console.log(`Hlambda metadata import call!`.yellow);
    // We expect zip as data uploaded to this route.
    console.log(req.file);

    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records

    console.log(zipEntries);

    console.log('Removing all the metadata...');
    console.log('clearing path: rm -rf ', path.resolve(`${path.resolve(`./metadata/`)}/*`));
    rimraf.sync(`${path.resolve(`./metadata/`)}/*`);

    zip.extractAllTo(path.resolve('./metadata/'), true);

    console.log('Done...');

    // Write file in data
    await fsPromise
      .writeFile(
        path.resolve(process.cwd(), './data/metadata-history/last-metadata-import-timestamp'),
        `${Date.now()}`,
        'utf8'
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[metadata-import] ERROR: can't write ./data/metadata-history/last-metadata-import-timestamp");
        console.error(error);
      });

    // setTimeout(() => {
    //   process.exit(0);
    // }, parseInt(getEnvValue(constants.ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS), 10));
    res.send(`Hlambda metadata imported!`);
  })
);

router.get(
  '/metadata/upload',
  asyncHandler((req, res) => {
    res.send(`
    <form action="/console/api/v1/metadata/import" method="post" enctype="multipart/form-data">
      <input type="file" name="metadata" />
      <input type="submit" name="submit">submit</input>
    </form>
    `);
  })
);

// router.post(
//   '/metadata/import/json',
//   asyncHandler((req, res) => {
//     res.send(`Hlambda metadata import page!`);
//     // Todo: Import metadata, force restart by shutting down, docker container needs to restart the process!

//     // We expect json as data uploaded to this route.

//     setTimeout(() => {
//       process.exit(0);
//     }, parseInt(getEnvValue(constants.ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS), 10));
//   })
// );

export default router;
