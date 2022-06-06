const readPackageVersion = async () => {
  /*
    Few ways to approach this, but it seems that the most logical one is to relay on the npm
    We could read package.json and parse it but we already have this info in the env variable.
    This function is to futureproof the loading of the server version.
  */
  const getPackageVersion = process.env.npm_package_version ?? '-';
  return getPackageVersion;
};

export default readPackageVersion;
