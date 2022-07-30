import express from 'express';
import asyncHandler from 'express-async-handler';

import { DateTime } from 'luxon';

import hasuraRequestLogger from './hasura-request-logger.js';

import errors from './errors.demo.js';

import requestTimeLogger from '../../../src/utils/requestTimer.js';

// Create express router
const router = express.Router();

router.use('/demo*', hasuraRequestLogger);
router.use('/demo*', requestTimeLogger);

router.get(
  '/demo',
  asyncHandler((req, res) => {
    res.send(`Demo app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
  })
);

router.get(
  '/demo-error',
  asyncHandler((req, res) => {
    // res.send(`Demo app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
    throw new Error(errors.SOMETHING_WENT_TERRIBLY_WRONG);
    // res.send(`Demo app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
  })
);

export default router;
