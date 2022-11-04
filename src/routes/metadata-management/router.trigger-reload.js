import express from 'express';
import asyncHandler from 'express-async-handler';

import reloadServer from './../../utils/reloadServer.js';

// Create express router
const router = express.Router();

router.get(
  '/trigger-reload',
  asyncHandler(async (req, res) => {
    console.log(`Reload triggered!`);
    await reloadServer();
    res.send(`Reload triggered!`);
  })
);

export default router;
