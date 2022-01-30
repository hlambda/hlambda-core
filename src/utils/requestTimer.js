const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
const requestTimeLogger = (req, res, next) => {
  const start = process.hrtime();
  console.log(`${req.method} ${req.originalUrl} [STARTED]`);

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    console.log(`${req.method} ${req.originalUrl} [FINISHED] in ${durationInMilliseconds} ms`);
  });

  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    console.log(`${req.method} ${req.originalUrl} [CLOSED] in ${durationInMilliseconds} ms`);
    console.log(Array(80 + 1).join('-'));
  });

  next();
};

export default requestTimeLogger;
