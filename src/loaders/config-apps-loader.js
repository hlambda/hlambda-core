import _ from 'lodash';
import { readFile } from 'fs/promises'
import path from 'path';
import glob from 'glob';
import YAML from 'yaml'

import { v4 as uuidv4 } from 'uuid';

const loadedConfigs = {};

// import route404 from './routes/404.js';

glob.sync(
  './metadata/**/hlambda-config.yaml', // Include all js files recursively.
  {
    ignore: [
      './**/node_modules/*', // Ignore the node_modules
    ],
  },
).forEach((file) => {
  const fileName = path.resolve(file);
  const fileExtension = path.extname(fileName);
  const fileBaseName = path.basename(fileName, fileExtension);

  // console.log(file);
  // console.log(fileExtension);
  // console.log(fileBaseName);

  if (fileBaseName.startsWith('hlambda-config')) {
    const moduleConfigId = uuidv4();
    // eslint-disable-next-line global-require, import/no-dynamic-require
    loadedConfigs[moduleConfigId] = readFile(file, 'utf8')
      .then((fileData) => {
        const result = YAML.parse(fileData)
        console.log(`[${moduleConfigId}] Module config`.green, `${file}`.yellow, `successfully loaded...`.green);
        return result;
      }).catch((error) => {
        console.error(`[${moduleConfigId}] Module config`.red, `${file.yellow}`, `errored out...`.red);
        console.error(error);
        return undefined
      }); // Returns promise
  }
});

console.time("Loading configs".green);
// Resolve all promises before exporting...
const resolvedLoadedConfigs = _.zipObject(_.keys(loadedConfigs), await Promise.all(_.values(loadedConfigs)));
console.timeEnd("Loading configs".green);

export default resolvedLoadedConfigs;
