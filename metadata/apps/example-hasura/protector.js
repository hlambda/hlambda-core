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
    const secret = req?.headers?.[getEnvValue(constants.ENV_HOOK_SECRET_HEADER_NAME)];
    // Check if protector is disabled. !!! Dangerous !!! But useful when testing in demo env.
    if (isEnvTrue(constants.ENV_DANGEROUS_DISABLE_HOOK_SECRET_AND_CONTINUE)) {
      next();
      return;
    }
    // Check if secret matches.
    if (secret !== getEnvValue(constants.ENV_HOOK_SECRET)) {
      throw new Error(errors.ERROR_INVALID_HOOK_SECRET);
    }
    next();
  })
);

export default router;
