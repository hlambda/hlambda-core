import express from 'express';
import asyncHandler from 'express-async-handler';
import AdmZip from 'adm-zip';
import path from 'path';
import fsPromise from 'fs/promises';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak source

router.post(
  '/metadata/export',
  asyncHandler(async (req, res) => {
    console.log(`Hlambda metadata export page!`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=hlambda-metadata.zip');

    // Write file in data
    await fsPromise
      .writeFile(path.resolve(process.cwd(), './data/last-metadata-export-timestamp'), `${Date.now()}`, 'utf8')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[restart-microservice] ERROR: can't write ./data/last-metadata-export-timestamp");
        console.error(error);
      });

    // const zip = await generateZipForPath('./metadata');
    const zip = new AdmZip();
    zip.addLocalFolder('./metadata');
    res.send(zip.toBuffer());
  })
);

router.post(
  '/metadata/export/json',
  asyncHandler(async (req, res) => {
    console.log(`Hlambda metadata json export page!`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=hlambda-metadata.zip');

    // Write file in data
    await fsPromise
      .writeFile(path.resolve(process.cwd(), './data/last-metadata-export-timestamp'), `${Date.now()}`, 'utf8')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[restart-microservice] ERROR: can't write ./data/last-metadata-export-timestamp");
        console.error(error);
      });

    // const zip = await generateZipForPath('./metadata');
    const zip = new AdmZip();
    zip.addLocalFolder('./metadata');
    res.send(zip.toBuffer());
  })
);

export default router;
