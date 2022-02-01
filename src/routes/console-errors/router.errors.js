import express from 'express';
import asyncHandler from 'express-async-handler';

import { ERROR_NAMESPACING } from 'hlambda';

// Create express router
const router = express.Router();

router.get(
  '/errors',
  asyncHandler(async (req, res) => {
    res.json(ERROR_NAMESPACING);
  })
);

export default router;
