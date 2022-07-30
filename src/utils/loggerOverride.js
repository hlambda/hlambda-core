import { format } from 'util';

import { constants, isEnvTrue } from './../constants/index.js';

const squashArgsArrayToConsoleIntoString = (...data) => {
  return [...data]
    .map((item) => {
      if (item instanceof Error) {
        return `${item.name}\n${item.message}\n${item.stack}`;
      }
      if (typeof item === 'object') {
        return JSON.stringify(item, null, 2);
      }
      return item;
    })
    .join(' ');
};

const { log } = console;
const { error } = console;

const buffer = [];

console.log = (...data) => {
  const textThatIGotUsingPrintfFormat = format(...data);
  const textThatIGot = squashArgsArrayToConsoleIntoString(...data);
  // Get the actuall text, this trick covers %s %s example for console.log();
  const textResult = textThatIGotUsingPrintfFormat === textThatIGot ? textThatIGot : textThatIGotUsingPrintfFormat;

  const shouldOutputJSON = isEnvTrue(constants.ENV_JSON_STDOUT);

  if (shouldOutputJSON) {
    log({
      timestamp: Date.now(),
      message: textResult,
      type: 'stdout',
    });
  } else {
    log(...data);
  }

  // Buffer should not be affected by the shouldOutputJSON
  buffer.push(textResult);

  if (buffer.length >= 255) {
    buffer.splice(0, 1);
  }
};

console.error = (...data) => {
  const textThatIGotUsingPrintfFormat = format(...data);
  const textThatIGot = squashArgsArrayToConsoleIntoString(...data);
  // Get the actuall text, this trick covers %s %s example for console.log();
  const textResult = textThatIGotUsingPrintfFormat === textThatIGot ? textThatIGot : textThatIGotUsingPrintfFormat;

  const shouldOutputJSON = isEnvTrue(constants.ENV_JSON_STDOUT);

  if (shouldOutputJSON) {
    error({
      timestamp: Date.now(),
      message: textResult,
      type: 'stderr',
    });
  } else {
    error(...data);
  }

  // Buffer should not be affected by the shouldOutputJSON
  buffer.push(textResult);

  if (buffer.length >= 255) {
    buffer.splice(0, 1);
  }
};

export default buffer;
