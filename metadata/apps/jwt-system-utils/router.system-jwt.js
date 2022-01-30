import express from 'express';
import asyncHandler from 'express-async-handler';

import { DateTime } from 'luxon';

import hasuraRequestLogger from './hasura-request-logger.js';

// Create express router
const router = express.Router();

router.use('/system/jwt', hasuraRequestLogger);

router.get(
  '/system/jwt/generate',
  asyncHandler((req, res) => {
    res.send(`Demo jwt app works: ${DateTime.now()}`);
  })
);

// export default router;
