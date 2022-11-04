import express from 'express';
import asyncHandler from 'express-async-handler';
import { DateTime } from 'luxon'; // Import third-party modules (Don't forget to install them)

import hasuraRequestLogger from './hasura-request-logger.js';
import requestTimeLogger from '../../../src/utils/requestTimer.js';

// import { constants, isEnvTrue, getEnvValue } from './constants.demo.js';
// import errors from './errors.demo.js';

// Create express router
const router = express.Router();

// Add middlewares
router.use('/demo*', hasuraRequestLogger);
router.use('/demo*', requestTimeLogger);

// Create route
router.get(
  '/demo',
  asyncHandler(async (req, res) => {
    res.send(`Hello Wolrld! <3 Hyper Lambda! (Hλ)\n\n${DateTime.now()}\n${process.env.SPECIAL_PASSWORD}`);
    // throw new Error(errors.SOMETHING_WENT_TERRIBLY_WRONG);
  })
);

export default router;
