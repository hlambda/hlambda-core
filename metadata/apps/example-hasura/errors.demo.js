import { createErrorDescriptor } from 'hlambda';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'example-hasura-app';

export const errors = {
  FUNCTIONALITY_NOT_IMPLEMENTED: {
    message:
      'Specific functionality is still in development. (It should be available soon, thank you for understanding.)',
  },
  SOMETHING_WENT_TERRIBLY_WRONG: {
    message: 'Description of an error message...',
  },
  ERROR_INVALID_HOOK_SECRET: {
    message: 'Invalid hook secret.',
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;
