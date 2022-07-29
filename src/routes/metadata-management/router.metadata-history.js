import express from 'express';
import asyncHandler from 'express-async-handler';

import path from 'path';
import fsp from 'fs/promises';
import { DateTime } from 'luxon';

// Define errors
import errors from './../../errors/index.js';
import consoleOutputBuffer from './../../utils/loggerOverride.js';

// Create express router
const router = express.Router();

router.get(
  '/metadata/history',
  asyncHandler(async (req, res) => {
    const lastMetadataExportTimestamp = await fsp
      .readFile('./data/last-metadata-export-timestamp')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return 0;
      });

    const lastMetadataClearTimestamp = await fsp
      .readFile('./data/last-metadata-clear-timestamp')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return 0;
      });

    const lastMetadataImportTimestamp = await fsp
      .readFile('./data/last-metadata-import-timestamp')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return 0;
      });

    const lastRestartedTimestamp = await fsp
      .readFile('./data/last-restarted-timestamp')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return 0;
      });

    const payload = {
      lastRestartedTimestamp,
      lastMetadataExportTimestamp,
      lastMetadataImportTimestamp,
      lastMetadataClearTimestamp,
      lastRestarted: DateTime.fromMillis(lastRestartedTimestamp).toISO(),
      lastMetadataExport: DateTime.fromMillis(lastMetadataExportTimestamp).toISO(),
      lastMetadataImport: DateTime.fromMillis(lastMetadataImportTimestamp).toISO(),
      lastMetadataClear: DateTime.fromMillis(lastMetadataClearTimestamp).toISO(),
    };
    res.status(200).send(JSON.stringify(payload, null, 2));
  })
);

export default router;
