import express from 'express';
import asyncHandler from 'express-async-handler';

import path from 'path';
import fsPromise from 'fs/promises';
// eslint-disable-next-line import/extensions
import { constants, getEnvValue } from '../../constants/index.js';

// Create express router
const router = express.Router();

router.get(
  '/trigger-restart',
  asyncHandler(async (req, res) => {
    res.send(`Restart triggered!`);

    // Write file in watch trigger
    await fsPromise
      .writeFile(path.resolve(process.cwd(), './watcher_trigger/restarted.txt'), `${Date.now()}`, 'utf8')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[restart-microservice] ERROR: can't write ./watcher_trigger/restarted.txt");
        console.error(error);
      });

    // Write file in data
    await fsPromise
      .writeFile(
        path.resolve(process.cwd(), './data/metadata-history/last-restarted-timestamp'),
        `${Date.now()}`,
        'utf8'
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[restart-microservice] ERROR: can't write ./data/metadata-history/last-restarted-timestamp");
        console.error(error);
      });

    setTimeout(() => {
      process.exit(0);
    }, parseInt(getEnvValue(constants.ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS), 10));
  })
);

export default router;
