import express from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import multer from 'multer';
import { writeFile } from 'fs/promises';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

const upload = multer({
  /* dest: 'uploads/' */
});

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.post(
  '/files/upload',
  upload.single('uploadFile'),
  asyncHandler(async (req, res) => {
    // Get file destination, because this is behind admin secret we do not need block ../../.../ attacks etc.
    // In this context it is not security issue it is a feature :)
    const destinationFilePath = path.resolve('./', req.body.path);

    // Write file to destination.
    await writeFile(destinationFilePath, req.file.buffer)
      .then(() => {
        console.log(`Done, uploading file to ${destinationFilePath}`);
      })
      .catch((error) => {
        console.log(error);
      });

    res.send(`File uploaded!`);
  })
);

export default router;
