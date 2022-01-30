// This is the place where function for checking the values from a specific constant is defined to be true.
export const isEnvTrue = (constantObject) => {
  const name = constantObject?.name;
  const defaultValue = constantObject?.default;

  return `${process.env[name] ?? defaultValue}`.toLocaleLowerCase() === 'true';
};

export default isEnvTrue;
