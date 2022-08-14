import express from 'express';
import asyncHandler from 'express-async-handler';

import jwt from 'jsonwebtoken';

// Define errors
import errors from './../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

// Create express router
const router = express.Router();

// Middleware to handle authorization for changing anything console related
router.use(
  asyncHandler(async (req, res, next) => {
    const token = req?.cookies?.['console-swagger-ui-access-token'];
    // console.log('token:', token);

    if (isEnvTrue(constants.ENV_HLAMBDA_DISABLE_ADMIN_SECRET)) {
      throw new Error(errors.ERROR_HLAMBDA_ADMIN_SECRET_DISABLED);
    }

    if (typeof token !== 'string') {
      throw new Error(errors.ERROR_INVALID_TOKEN_PROVIDED);
    }

    await jwt.verify(token, getEnvValue(constants.ENV_HLAMBDA_ADMIN_SECRET), (err, user) => {
      if (err) {
        console.log(err);
        throw new Error(errors.ERROR_FORBIDDEN);
        // return res.sendStatus(403)
      }

      next();
    });

    // next();
  })
);

export default router;
