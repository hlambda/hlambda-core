import { createErrorDescriptor } from 'hlambda';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'socket-io';

export const errors = {
  SOCKET_SERVER_NOT_RUNNING: {
    message: 'Socket server is not available.',
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;
