import express from 'express';
import asyncHandler from 'express-async-handler';

import githubWebHookProtectorMiddleware from './protector.js';
import reloadServer from './../../../src/utils/reloadServer.js';

// Create express router
const router = express.Router();

// Change this middleware to match the auth you need, this auth is demo auth example, not a ready-made middleware for github auth
// You will need to check HMAC signature etc.
router.use('/hooks/github/*', githubWebHookProtectorMiddleware);

router.post(
  '/hooks/github/new-change',
  asyncHandler(async (req, res) => {
    console.log(`Reload triggered! - By Github Hook`);
    // Trigger the zero-downtime reload
    await reloadServer();
    // Return the response
    res.send(`Reload triggered!`);
  })
);

export default router;
