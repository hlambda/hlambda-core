import { readFile } from 'fs/promises';
import readPackageJson from './readPackageJson.js';

const readPackageVersion = async () => {
  /*
    Few ways to approach this, but it seems that the most logical one is to relay on the npm
    We could read package.json and parse it but we already have this info in the env variable.
    This function is to futureproof the loading of the server version.
  */
  if (typeof process.env.npm_package_version === 'string') {
    const getPackageVersion = process.env.npm_package_version ?? '-';
    return getPackageVersion;
  }

  const data = await readPackageJson()
    .then((jsonData) => {
      return jsonData;
    })
    .catch((error) => {});

  return data?.version ?? '-';
};

export default readPackageVersion;
