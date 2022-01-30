import 'colors';

const hasuraErrorHandler = (error, req, res, next) => {
  let errorOut = {};

  let parsed = {};
  try {
    parsed = JSON.parse(error.message);
    errorOut = {
      ...parsed,
    };
  } catch (e) {
    errorOut.code = 'UNKNOWN_ERROR';
    errorOut.message = typeof error.message === 'string' ? error.message : JSON.stringify(error.message, null, 2);

    // console.log(JSON.stringify(error));

    console.error('[ERROR] Edge case | Unknown error, please define the error and cover the edge case.'.red);
    console.error(error.stack);
  }
  if (process.env.NODE_ENV === 'development-debug') errorOut.location = error.location;
  if (process.env.NODE_ENV === 'development-debug') errorOut.details = error.stack.split('\n');
  // errorOut.path = error.path;

  // console.error(error.stack);
  console.log(`Request for -> ${req.method} ${req.originalUrl}`.red);
  console.error('[ERROR]'.red, `${errorOut.code}`.red, `\n${errorOut.message}`.yellow);
  console.log(Array(80 + 1).join('-'));

  return res.status(400).json(errorOut);
};

export default hasuraErrorHandler;
