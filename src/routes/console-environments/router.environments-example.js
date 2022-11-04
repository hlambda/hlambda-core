import express from 'express';
import asyncHandler from 'express-async-handler';

import { readFile } from 'fs/promises';

// Create express router
const router = express.Router();

router.get(
  '/environments-example',
  asyncHandler(async (req, res) => {
    const fileData = await readFile('./.env.example', 'utf-8')
      .then((fileReadData) => {
        // console.log('File read successfull!'.green);
        return fileReadData;
      })
      .catch(() => {
        console.log('File read failed!'.red);
      });

    res.send(fileData);
  })
);

export default router;
