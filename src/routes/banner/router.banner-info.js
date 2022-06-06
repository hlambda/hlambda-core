import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';
import errors from './../../errors/index.js';

// Create express router
const router = express.Router();

router.get(
  '/banner-info',
  asyncHandler(async (req, res) => {
    const ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER = getEnvValue(constants.ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER);
    const ENV_HLAMBDA_ENVIRONMENT_BANNER_NAME = getEnvValue(constants.ENV_HLAMBDA_ENVIRONMENT_BANNER_NAME);
    const ENV_HLAMBDA_ENVIRONMENT_BANNER_MESSAGE = getEnvValue(constants.ENV_HLAMBDA_ENVIRONMENT_BANNER_MESSAGE);
    const ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR = getEnvValue(
      constants.ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR
    );

    const banner = {
      enabled: ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER,
      name: ENV_HLAMBDA_ENVIRONMENT_BANNER_NAME,
      message: ENV_HLAMBDA_ENVIRONMENT_BANNER_MESSAGE,
      color: ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR,
    };

    res.status(200).json(banner);
  })
);

export default router;
