import express from 'express';
import asyncHandler from 'express-async-handler';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

router.get(
  '/admin-secret',
  asyncHandler(async (req, res) => {
    res.send(getEnvValue(constants.ENV_HLAMBDA_ADMIN_SECRET));
  })
);

export default router;
