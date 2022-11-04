import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../../errors/index.js';
import { clearBuffer } from './../../utils/expressRequestHistoryRecorderMiddleware.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak request history

router.get(
  '/history/requests/clear',
  asyncHandler(async (req, res) => {
    clearBuffer();
    res.send(`Done!`);
  })
);

export default router;
