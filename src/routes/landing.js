import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
// import errors from './../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

// Create express router
const router = express.Router();

// Middleware
router.get(
  '/',
  asyncHandler((req, res, next) => {
    if (isEnvTrue(constants.ENV_HLAMBDA_DISABLE_ADMIN_SECRET)) {
      next();
      // eslint-disable-next-line no-useless-return
      return;
      // eslint-disable-next-line no-else-return
    } else {
      res.header('Cache-Control', 'no-cache');
      res.redirect(301, '/console/');
    }
  })
);

export default router;
