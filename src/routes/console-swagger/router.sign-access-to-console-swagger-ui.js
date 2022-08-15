import express from 'express';
import asyncHandler from 'express-async-handler';

import jwt from 'jsonwebtoken';

// Define errors
import errors from './../../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

router.get(
  '/console-swagger-ui-sign-access',
  asyncHandler(async (req, res) => {
    const payload = {
      access: 'console-swagger-ui',
    };

    const token = await jwt.sign(payload, getEnvValue(constants.ENV_HLAMBDA_ADMIN_SECRET), { expiresIn: '86400s' });

    res.cookie('console-swagger-ui-access-token', token, { maxAge: 3600 * 24, httpOnly: true });
    // res.redirect('/console/docs');
    res.send(token);
  })
);
export default router;
