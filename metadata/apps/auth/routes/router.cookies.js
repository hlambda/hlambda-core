import express from 'express';
import asyncHandler from 'express-async-handler';

import cookieParser from 'cookie-parser';

import errors from './../errors.demo.js';

// Create express router
const router = express.Router();

// router.use(cookieParser()); // Use this if you have set ENV_DISABLE_EXPRESS_COOKIE_PARSER to true.

router.get(
  '/cookie/set',
  asyncHandler((req, res) => {
    res.cookie('demo-jwt-token', 'token ey...', { maxAge: 10800 });
    res.send(`Demo token set!`);
  })
);

router.get(
  '/cookie/get',
  asyncHandler((req, res) => {
    console.log('Cookies: ', req.cookies);
    res.send(JSON.stringify(req.cookies, null, 2));
  })
);

export default router;
