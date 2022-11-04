import { createConstantsDescriptor } from 'hlambda';

export { isEnvTrue, getEnvValue } from 'hlambda';

// --- START SAFE TO EDIT ---

export const constantsGroupName = 'example-github-hook-app';

export const constants = {
  ENV_GITHUB_HOOK_SECRET_HEADER_NAME: {
    name: 'GITHUB_HOOK_SECRET_HEADER_NAME',
    default: 'x-github-hook-secret', // Default value
    description: 'Name of the header where hook secret will be found.',
  },
  ENV_GITHUB_HOOK_SECRET: {
    name: 'GITHUB_HOOK_SECRET',
    default: 'you-must-change-me', // Default value
    description: 'Secret used to protect hooks.',
  },
};

// --- STOP SAFE TO EDIT ---

export const cd = createConstantsDescriptor(constants, constantsGroupName);

export default constants;
