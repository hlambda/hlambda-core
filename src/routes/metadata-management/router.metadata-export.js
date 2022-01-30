import express from 'express';
import asyncHandler from 'express-async-handler';
import AdmZip from 'adm-zip';

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
    // const zip = await generateZipForPath('./metadata');
    const zip = new AdmZip();
    zip.addLocalFolder('./metadata');
    res.send(zip.toBuffer());
  })
);

export default router;
