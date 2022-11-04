import express from 'express';
import asyncHandler from 'express-async-handler';
import { DateTime } from 'luxon'; // Import third-party modules (Don't forget to install them)

import hasuraRequestLogger from './hasura-request-logger.js';
import requestTimeLogger from '../../../src/utils/requestTimer.js';

import errors from './errors.demo.js';

// Create express router
const router = express.Router();

const stringValue: string = '3';

('#fefefe');

// Add middlewares
router.use('/ts*', hasuraRequestLogger);
router.use('/ts*', requestTimeLogger);

// Create route
router.get(
  '/ts',
  asyncHandler(async (req, res) => {
    // console.log(stringValue.toFixed(8));
    res.send(`ts app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
  })
);

// // To releax the TSC when throwing errors.__ERROR__
// interface ErrorConstructor {
//   new (message?: string | { message: string }): Error;
//   (message?: string | { message: string }): Error;
//   readonly prototype: Error;
// }
// declare var Error: ErrorConstructor;

// router.get(
//   '/ts-error',
//   asyncHandler(async (req, res) => {
//     // res.send(`Demo app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
//     throw new Error(errors.SOMETHING_WENT_TERRIBLY_WRONG);
//     // res.send(`Demo app works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
//   })
// );

export default router;
