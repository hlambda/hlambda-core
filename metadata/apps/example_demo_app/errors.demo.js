import { createErrorDescriptor } from '../../../src/utils/errors.js';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'demo-hlambda-app';

export const errors = {
  FUNCTIONALITY_NOT_IMPLEMENTED: {
    message:
      'Specific functionality is still in development. (It should be available soon, thank you for understanding.)',
  },
  SOMETHING_WENT_TERRIBLY_WRONG: {
    message: 'Description of an error message...',
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;
