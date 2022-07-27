import express from 'express';
import asyncHandler from 'express-async-handler';

// Create express router
const router = express.Router();

router.get(
  '/environments',
  asyncHandler(async (req, res) => {
    res.send(JSON.stringify(process.env, null, 2));
  })
);

export default router;
