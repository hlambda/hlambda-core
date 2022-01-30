import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

router.get(
  '/import-license',
  asyncHandler(async (req, res) => {
    res.json({
      licenseHolderName: '',
    });
  })
);

router.get(
  '/license',
  asyncHandler(async (req, res) => {
    res.json({
      licenseHolderName: '',
    });
  })
);

export default router;
