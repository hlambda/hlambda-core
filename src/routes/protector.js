import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

// Create express router
const router = express.Router();

// Middleware to handle authorization for changing anything console related
router.use(
  asyncHandler((req, res, next) => {
    const secret = req?.headers?.['x-hlambda-admin-secret'];
    if (isEnvTrue(constants.ENV_HLAMBDA_DISABLE_ADMIN_SECRET)) {
      throw new Error(errors.ERROR_HLAMBDA_ADMIN_SECRET_DISABLED);
    }
    if (secret !== getEnvValue(constants.ENV_HLAMBDA_ADMIN_SECRET)) {
      throw new Error(errors.ERROR_INVALID_HLAMBDA_ADMIN_SECRET);
    }
    next();
  })
);

export default router;
