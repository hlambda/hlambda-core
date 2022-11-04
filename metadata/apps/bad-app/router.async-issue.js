/*
// Uncomment this file to test how Hlambda handles bad code with errors.

import express from 'express';
import asyncHandler from 'express-async-handler';

// Create express router
const router = express.Router();

// This app is intentionally wrong, fix it your self to see that even broken scripts won't kill hlambda container

router.get(
  '/await-but-not-async',
  asyncHandler(
    // async
    (req, res) => {
      await (async () => {})()
      res.send(`Be careful that your resolver really is async when you use await. There will be no stacktrace`);
  })
);

export default router;

*/
