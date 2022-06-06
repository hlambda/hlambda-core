import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';
import errors from './../../errors/index.js';

import readPackageVersion from './../../utils/readPackageVersion.js';

// Create express router
const router = express.Router();

router.get(
  '/version',
  asyncHandler(async (req, res) => {
    const getPackageVersion = await readPackageVersion()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        return '-';
      });
    res.status(200).send(getPackageVersion);
  })
);

export default router;
