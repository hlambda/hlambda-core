// One way of writing it, but I'm fan of removing necessary boilerplate and generate
// data on runtime if possible.
// const UNKNOWN_USER = 'UNKNOWN_USER';

// module.exports = {
//   UNKNOWN_USER,
// };

import { createErrorDescriptor } from '../utils/errors.js';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'hlambda-main';

export const errors = {
  FUNCTIONALITY_NOT_IMPLEMENTED: {
    message:
      'Specific functionality is still in development. (It should be available soon, thank you for understanding.)',
  },
  ERROR_PAGE_NOT_FOUND: {
    message: 'Requested endpoint does not exist.',
  },

  // Hlambda
  ERROR_HLAMBDA_ADMIN_SECRET_DISABLED: {
    message: 'Admin secret is disabled.',
  },
  ERROR_INVALID_HLAMBDA_ADMIN_SECRET: {
    message: `Invalida hlambda admin secret! Check 'x-hlambda-admin-secret'.`,
  },

  // Special errors
  UNKNOWN_ERROR: {
    message: 'Unknown server error.',
    handler: () => {
      console.error(
        '[ERROR]: DANGER! Unknown error was detected! Please define all known error states and handle them accordingly!'
      );
    },
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;
