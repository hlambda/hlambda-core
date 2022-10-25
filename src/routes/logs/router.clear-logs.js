import express from 'express';
import asyncHandler from 'express-async-handler';

import AnsiUp from 'ansi_up';

// Define errors
import errors from './../../errors/index.js';
import consoleOutputBuffer, { clearBuffer } from './../../utils/loggerOverride.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to enable logs manipulation

router.get(
  '/logs/clear',
  asyncHandler(async (req, res) => {
    clearBuffer();
    res.send(`Done!`);
  })
);

export default router;
