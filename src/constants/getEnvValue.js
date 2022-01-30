// This is the place where function for getting the values from a specific constant is defined.
export const getEnvValue = (constantObject) => {
  const name = constantObject?.name;
  const defaultValue = constantObject?.default;

  return process.env[name] ?? defaultValue;
};

export default getEnvValue;
