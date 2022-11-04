import express from 'express';
import asyncHandler from 'express-async-handler';
import { DateTime } from 'luxon';
import hasuraRequestLogger from './../hasura-request-logger.js';
import errors from './../errors.demo.js';

const router = express.Router();

router.use('/hook/auth*', hasuraRequestLogger);

router.get(
  '/hook/auth',
  asyncHandler(async (req, res) => {
    res.send(`Demo auth hook works: ${DateTime.now()} ${process.env.SPECIAL_PASSWORD}`);
  })
);

export default router;
