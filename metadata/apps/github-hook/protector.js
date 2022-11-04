import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './errors.demo.js';
import { constants, isEnvTrue, getEnvValue } from './constants.demo.js';

// Create express router
const router = express.Router();

// Middleware to handle authorization for the web hook.
router.use(
  asyncHandler((req, res, next) => {
    const secret = req?.headers?.[getEnvValue(constants.ENV_GITHUB_HOOK_SECRET_HEADER_NAME)];
    // Check if secret matches.
    if (secret !== getEnvValue(constants.ENV_GITHUB_HOOK_SECRET)) {
      throw new Error(errors.ERROR_INVALID_GITHUB_HOOK_SECRET);
    }
    next();
  })
);

export default router;
