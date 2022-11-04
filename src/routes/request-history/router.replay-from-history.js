import _ from 'lodash';
import express from 'express';
import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';

// Define errors
import { constants, getEnvValue } from './../../constants/index.js';
import errors from './../../errors/index.js';
import { buffer } from './../../utils/expressRequestHistoryRecorderMiddleware.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak request history

router.post(
  '/history/requests/replay',
  asyncHandler(async (req, res) => {
    const requestId = req.body?.id ?? req.query?.id ?? '-';

    // Find request with that id in the buffer
    const requestHistoryObject = _.find(buffer, (request) => {
      return request?.requestId === requestId;
    });

    // Throw error if we can't find request
    if (typeof requestHistoryObject === 'undefined') {
      throw new Error(errors.ERROR_INVALID_REQUEST_HISTORY_ID);
    }

    // Get the PORT.
    const SERVER_PORT = getEnvValue(constants.ENV_SERVER_PORT);

    // Execute node fetch for that route
    const result = await fetch(`http://localhost:${SERVER_PORT}${requestHistoryObject?.originalUrl ?? '/'}`, {
      method: requestHistoryObject?.method,
      headers: {
        ...requestHistoryObject?.headers,
      },
      body: requestHistoryObject?.body,
    });

    const resultData = await result
      .text()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });

    res.send(resultData);
  })
);

export default router;
