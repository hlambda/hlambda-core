import path from 'path';
import execScriptCommand from './execScriptCommand.js';
import reloadServer from './reloadServer.js';

// Define constants and constants defaults
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

// Define timer reference
let timer;

export const gitSync = async () => {
  const commandToExecute = getEnvValue(constants.ENV_HLAMBDA_GIT_SYNC_COMMAND);
  // TODO: Implement actuall git pull and check for the results, including auth.
  const result = await execScriptCommand(commandToExecute);
  // console.log(result);
  if (!result.stdout.includes('Already up to date.') && result.code === 0) {
    console.log('GitSync - Reloading...'.yellow);
    await reloadServer();
  }
};

export const stopGitSync = async () => {
  if (timer) {
    clearInterval(timer);
  }
};

export const startGitSync = async () => {
  const HLAMBDA_GIT_SYNC_INTERVAL_SECONDS = parseInt(getEnvValue(constants.ENV_HLAMBDA_GIT_SYNC_INTERVAL_SECONDS), 10);
  if (typeof HLAMBDA_GIT_SYNC_INTERVAL_SECONDS === 'number' && HLAMBDA_GIT_SYNC_INTERVAL_SECONDS !== 0) {
    // All good
    console.log('Git sync started!'.green);
  } else {
    console.log('Git sync disabled. Git sync interval seconds are set to 0.'.red);
    return;
  }

  timer = setInterval(async () => {
    try {
      console.log('[tick] Git Sync!'.yellow);
      await gitSync();
    } catch (error) {
      console.log(error);
    }
  }, HLAMBDA_GIT_SYNC_INTERVAL_SECONDS * 1000);
};

export default startGitSync;
