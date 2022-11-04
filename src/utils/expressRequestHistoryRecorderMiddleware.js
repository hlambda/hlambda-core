import { v4 as uuidv4 } from 'uuid';
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

export const buffer = [];

export const expressRequestHistoryRecorderMiddleware = (req, res, next) => {
  // Ignore the history for console. Maybe in future enable or disable this via env config.
  const regex = /^\/console\/*/g;
  if (req.originalUrl.match(regex)) {
    next();
    return;
  }
  // --------------------------------------------------------------------------------
  const requestHistoryObject = {
    requestId: uuidv4(),
    timestamp: new Date().toISOString(),
    originalUrl: req.originalUrl,
    method: req.method,
    headers: req.headers,
    body: req.body,
  };
  // --------------------------------------------------------------------------------
  buffer.push(requestHistoryObject);
  // Circular buffer, if we are over the threshold drop item.
  if (buffer.length >= parseInt(getEnvValue(constants.ENV_EXPRESS_REQUEST_LOG_HISTORY_BUFFER_SIZE), 10)) {
    buffer.splice(0, 1);
  }
  // --------------------------------------------------------------------------------
  next();
};

export const clearBuffer = () => {
  // Use splice to remove all items
  buffer.splice(0, buffer.length);
};

export default expressRequestHistoryRecorderMiddleware;
