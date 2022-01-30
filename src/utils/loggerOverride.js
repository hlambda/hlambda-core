import { format } from 'util';

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
  log(...data);

  const textThatIGotUsingPrintfFormat = format(...data);
  const textThatIGot = squashArgsArrayToConsoleIntoString(...data);

  if (textThatIGotUsingPrintfFormat === textThatIGot) {
    buffer.push(textThatIGot);
  } else {
    buffer.push(textThatIGotUsingPrintfFormat);
  }

  if (buffer.length >= 255) {
    buffer.splice(0, 1);
  }
};

console.error = (...data) => {
  error(...data);

  const textThatIGotUsingPrintfFormat = format(...data);
  const textThatIGot = squashArgsArrayToConsoleIntoString(...data);

  if (textThatIGotUsingPrintfFormat === textThatIGot) {
    buffer.push(textThatIGot);
  } else {
    buffer.push(textThatIGotUsingPrintfFormat);
  }

  if (buffer.length >= 255) {
    buffer.splice(0, 1);
  }
};

export default buffer;
