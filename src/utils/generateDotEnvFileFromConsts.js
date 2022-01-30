/* eslint-disable no-undef */
import _ from 'lodash';
import fsPromise from 'fs/promises';

// Define constants and constants defaults
import { constants, isEnvTrue, getEnvValue } from './../constants/index.js';

const generateDotEnvFileFromConsts = async (showDefaultUndefined = false) => {
  let text = ``;
  // eslint-disable-next-line guard-for-in, no-undef
  for (const constantKey in constants) {
    const constantObj = _.get(constants, constantKey);

    const nameValue = _.get(constantObj, 'name');
    const defaultValue = _.get(constantObj, 'default');
    const descriptionValue = _.get(constantObj, 'description');
    if (constantKey.startsWith('ENV_') && (typeof defaultValue !== 'undefined' || showDefaultUndefined)) {
      // Start writing envs
      if (typeof descriptionValue === 'string') {
        text += `# Constant reference in code: ${constantKey} | Default value: ${defaultValue}\n# ${descriptionValue}\n`;
      }
      text += `${nameValue}=${JSON.stringify(defaultValue)}\n\n`;
    }
  }

  const fileData = await fsPromise
    .readFile('./.env.example', 'utf8')
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("[generateDotEnvFileFromConsts] ERROR: can't read .env.example");
      console.error(error);
    });
  if (text !== fileData) {
    await fsPromise
      .writeFile('./.env.example', text, 'utf8')
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("[generateDotEnvFileFromConsts] ERROR: can't write .env.example");
        console.error(error);
      });
  }

  return text;
};

export default generateDotEnvFileFromConsts;
