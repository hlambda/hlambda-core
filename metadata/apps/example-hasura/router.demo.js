import express from 'express';
import asyncHandler from 'express-async-handler';

// Import our custom request logger
import hasuraRequestLogger from './hasura-request-logger.js';

// Import our errors definition
import errors from './errors.demo.js';

// Create express router
const router = express.Router();

router.use('/hasura-*', hasuraRequestLogger);

router.post(
  '/hasura-version',
  asyncHandler((req, res) => {
    console.log(`${process.env.APP_VERSION}`);
    throw new Error(errors.SOMETHING_WENT_TERRIBLY_WRONG);
    // res.json({
    //   version: `${process.env.APP_VERSION}`,
    // });
  })
);

export default router;
