import _ from 'lodash';
import path from 'path';
import glob from 'glob';

const loadedRoutes = {};

glob
  .sync(
    './src/routes/**/*.js', // Include all js files recursively.
    {
      ignore: [
        './src/routes/index.js', // Ignore it self...
        './src/routes/special/*.js', // Ignore the ones in special folder.
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

    if (fileBaseName.startsWith('router.')) {
      // This is added to not load index.js itself :)
      // eslint-disable-next-line global-require, import/no-dynamic-require
      loadedRoutes[fileBaseName] = import(`file:///${fileName}`); // Returns promise
    }
  });

// Resolve all promises before exporting...
const resolvedLoadedRoutes = _.zipObject(
  _.keys(loadedRoutes),
  await Promise.all(_.values(loadedRoutes))
);

export default resolvedLoadedRoutes;
