/*
// Uncomment this file to test how Hlambda handles bad code with errors.

import express from 'express';
import asyncHandler from 'express-async-handler';

import { DateTime } from 'luxon';

// import errors from './errors.bad-app.js';

// Create express router
const router = express.Router();

// This error is intentional, fix it your self to see that even broken scripts won't kill hlambda container
zzzzz;

router.get(
  '/share-dependency',
  asyncHandler((req, res) => {
    res.send(`Prototype login works: ${DateTime.now()}`);
  })
);

// This error is intentional, fix it your self to see that even broken scripts won't kill hlambda container
aaa;

export default router;

*/
