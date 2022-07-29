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
      .readFile('./data/last-metadata-export-timestamp', 'utf-8')
      .then((data) => {
        return parseInt(data, 10);
      })
      .catch((error) => {
        // return 0;
      });

    const lastMetadataClearTimestamp = await fsp
      .readFile('./data/last-metadata-clear-timestamp', 'utf-8')
      .then((data) => {
        return parseInt(data, 10);
      })
      .catch((error) => {
        // return 0;
      });

    const lastMetadataImportTimestamp = await fsp
      .readFile('./data/last-metadata-import-timestamp', 'utf-8')
      .then((data) => {
        return parseInt(data, 10);
      })
      .catch((error) => {
        // return 0;
      });

    const lastRestartedTimestamp = await fsp
      .readFile('./data/last-restarted-timestamp', 'utf-8')
      .then((data) => {
        return parseInt(data, 10);
      })
      .catch((error) => {
        // return 0;
      });

    const payload = {
      lastRestartedTimestamp,
      lastMetadataExportTimestamp,
      lastMetadataImportTimestamp,
      lastMetadataClearTimestamp,
      lastRestarted:
        typeof lastRestartedTimestamp === 'number' ? DateTime.fromMillis(lastRestartedTimestamp).toISO() : null,
      lastMetadataExport:
        typeof lastMetadataExportTimestamp === 'number'
          ? DateTime.fromMillis(lastMetadataExportTimestamp).toISO()
          : null,
      lastMetadataImport:
        typeof lastMetadataImportTimestamp === 'number'
          ? DateTime.fromMillis(lastMetadataImportTimestamp).toISO()
          : null,
      lastMetadataClear:
        typeof lastMetadataClearTimestamp === 'number' ? DateTime.fromMillis(lastMetadataClearTimestamp).toISO() : null,
    };
    res.status(200).send(JSON.stringify(payload, null, 2));
  })
);

export default router;
