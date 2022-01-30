import express from 'express';
import asyncHandler from 'express-async-handler';

import { ERROR_NAMESPACING } from '../../../src/utils/errors.js';

// Create express router
const router = express.Router();

router.get(
  '/constants',
  asyncHandler(async (req, res) => {
    res.json(ERROR_NAMESPACING);
  })
);

export default router;
