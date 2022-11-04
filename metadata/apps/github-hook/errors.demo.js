import { createErrorDescriptor } from 'hlambda';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'example-github-hook-app';

export const errors = {
  ERROR_INVALID_GITHUB_HOOK_SECRET: {
    message: 'Invalid hook secret.',
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;
