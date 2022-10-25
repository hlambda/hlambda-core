import { readFile } from 'fs/promises';

const readPackageJson = async () => {
  const getPackageJsonAsString = await readFile('./package.json', 'utf8')
    .then((fileData) => {
      return fileData;
    })
    .catch((error) => {
      console.log(error);
      return {};
    });

  let data;
  try {
    data = JSON.parse(getPackageJsonAsString);
  } catch (error) {
    console.log(error);
  }

  return data;
};

export default readPackageJson;
