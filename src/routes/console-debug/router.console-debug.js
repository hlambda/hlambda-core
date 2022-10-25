import express from 'express';
import asyncHandler from 'express-async-handler';

import delay from './../../utils/delay.js';

// Define errors
import errors from './../../errors/index.js';
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

router.get(
  '/debug/console-debug-slow-response',
  asyncHandler(async (req, res) => {
    for (let i = 0; i < 10; i += 1) {
      console.log('processing...');
      // eslint-disable-next-line no-await-in-loop
      await delay(2500);
    }

    res.send('SLOW OK');
  })
);
export default router;
