import express from 'express';
import asyncHandler from 'express-async-handler';
import path from 'path';
import rimraf from 'rimraf';

import { constants, getEnvValue } from './../../constants/index.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to have RCE!

router.get(
  '/metadata/clear',
  asyncHandler((req, res) => {
    console.log('Removing all the metadata...');
    console.log('clearing path: rm -rf ', path.resolve(`./metadata/`));
    rimraf.sync(path.resolve(`./metadata/`));
    res.send(`Hlambda metadata cleared!`);
  })
);

export default router;
