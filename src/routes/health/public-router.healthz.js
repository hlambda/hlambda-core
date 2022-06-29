import express from 'express';
import asyncHandler from 'express-async-handler';

// Create express router
const router = express.Router();

router.get(
  '/healthz',
  asyncHandler(async (req, res) => {
    res.status(200).send('OK');
  })
);

export default router;
