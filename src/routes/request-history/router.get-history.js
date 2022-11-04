import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../../errors/index.js';
import { buffer } from './../../utils/expressRequestHistoryRecorderMiddleware.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak request history

router.get(
  '/history/requests',
  asyncHandler(async (req, res) => {
    const outputType = req.query?.type ?? 'json';

    res.send(JSON.stringify(buffer, null, 2));
  })
);

export default router;
