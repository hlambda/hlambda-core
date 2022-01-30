import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

router.get(
  '/check-connection',
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
    });
  })
);

export default router;
