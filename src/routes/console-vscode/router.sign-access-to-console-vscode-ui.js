import express from 'express';
import asyncHandler from 'express-async-handler';

import jwt from 'jsonwebtoken';

// Define errors
import errors from './../../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

router.get(
  '/console-vscode-ui-sign-access',
  asyncHandler(async (req, res) => {
    const payload = {
      access: 'console-vscode-ui',
    };

    const expiresIn = parseInt(getEnvValue(constants.ENV_HLAMBDA_VSCODE_UI_TOKEN_EXPIRES_IN_SECONDS), 10);

    const token = jwt.sign(payload, getEnvValue(constants.ENV_HLAMBDA_ADMIN_SECRET), {
      expiresIn: `${expiresIn}s`, // This is set to string in seconds. '86400s'
    });

    res.cookie('console-vscode-ui-access-token', token, { maxAge: expiresIn * 1000, httpOnly: true });
    // res.redirect('/console/docs');
    res.send(token);
  })
);
export default router;
