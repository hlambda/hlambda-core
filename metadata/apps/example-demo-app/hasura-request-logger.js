import 'colors';

const hasuraRequestLogger = (req, res, next) => {
  console.log(`[${req.originalUrl}] Request hit!`);
  // --------------------------------------------------------------------------------
  // Get variables
  console.log('This is what we received from Hasura when calling the hook');
  console.log(req.body);
  console.log(Array(80 + 1).join('-'));
  // --------------------------------------------------------------------------------
  next();
};

export default hasuraRequestLogger;
