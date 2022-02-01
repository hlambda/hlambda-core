import express from 'express';
import asyncHandler from 'express-async-handler';

import { CONSTANTS_NAMESPACING } from 'hlambda';

// Create express router
const router = express.Router();

router.get(
  '/constants',
  asyncHandler(async (req, res) => {
    res.json(CONSTANTS_NAMESPACING);
  })
);

export default router;
