import _ from 'lodash';
import path from 'path';
import glob from 'glob';

import { v4 as uuidv4 } from 'uuid';
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

const ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX = getEnvValue(constants.ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX);

const loadedEntrypoints = {};

glob
  .sync(
    `./metadata/**/${ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX}*.js`, // Include all js files recursively.
    {
      ignore: [
        './metadata/**/index.js', // Ignore it self...
        './metadata/**/routes/special/*.js', // Ignore the ones in special folder.
        './**/node_modules/*', // Ignore the node_modules
      ],
    }
  )
  .forEach((file) => {
    const fileName = path.resolve(file);
    const fileExtension = path.extname(fileName);
    const fileBaseName = path.basename(fileName, fileExtension);

    // console.log(fileName);
    // console.log(fileExtension);
    // console.log(fileBaseName);

    if (fileBaseName.startsWith(`${ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX}`)) {
      // This is added to not load index.js itself :)
      const moduleId = uuidv4();
      // eslint-disable-next-line global-require, import/no-dynamic-require
      loadedEntrypoints[moduleId] = import(`file:///${fileName}`)
        .then((module) => {
          console.log(`[${moduleId}] Module`.green, `${fileBaseName}`.yellow, `successfully loaded...`.green);
          return module;
        })
        .catch((error) => {
          console.error(`[${moduleId}] Module`.red, `${fileBaseName.yellow}`, `errored out...`.red);
          console.error(error);
          return undefined; // It is fine to return undefined, we will handle ?.default when loading module
        }); // Returns promise
    }
  });

console.time('Loading entrypoint'.green);
// Resolve all promises before exporting...
const resolvedLoadedEntrypoints = _.zipObject(
  _.keys(loadedEntrypoints),
  await Promise.all(_.values(loadedEntrypoints))
);
console.timeEnd('Loading entrypoint'.green);

export default resolvedLoadedEntrypoints;
