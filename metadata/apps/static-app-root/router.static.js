/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import express from 'express';
import asyncHandler from 'express-async-handler';

import { executeWithAdminRights, getEnvValue, isEnvTrue } from 'hlambda';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// // Define constants & errors
// import constants from "./../../constants/constants.index.js";
// import errors from "./../../errors/errors.index.js";

// Create express router
const router = express.Router();

router.use(express.static(path.resolve(__dirname, './public')));

export default router;
