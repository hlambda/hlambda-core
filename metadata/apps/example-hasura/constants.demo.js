import { createConstantsDescriptor } from 'hlambda';

export { isEnvTrue, getEnvValue } from 'hlambda';

// --- START SAFE TO EDIT ---

export const constantsGroupName = 'example-hasura-app';

export const constants = {
  ENV_HOOK_SECRET_HEADER_NAME: {
    name: 'HOOK_SECRET_HEADER_NAME',
    default: 'x-hook-secret', // Default value
    description: 'Name of the header where hook secret will be found.',
  },
  ENV_HOOK_SECRET: {
    name: 'HOOK_SECRET',
    default: 'you-must-change-me', // Default value
    description: 'Secret used to protect hooks.',
  },
  ENV_DANGEROUS_DISABLE_HOOK_SECRET_AND_CONTINUE: {
    name: 'DANGEROUS_DISABLE_HOOK_SECRET_AND_CONTINUE',
    default: 'false', // Default value
    description:
      'If set to true, HOOK_SECRET check will be disabled and anyone without hook secret can trigger the hook. (Default: false)',
  },
};

// --- STOP SAFE TO EDIT ---

export const cd = createConstantsDescriptor(constants, constantsGroupName);

export default constants;
