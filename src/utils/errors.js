export const errorObjectEnahancer = (
  ERRORS_IN,
  MICROSERVICE_NAME,
  overrideByReference = true,
  implementToStringPrototype = true
) => {
  const NEW_ERRORS = Object.keys(ERRORS_IN).reduce((acc, key, index) => {
    const object = ERRORS_IN[key];
    // Attach code to the error object as extension that Hasura supports
    acc[key] = {
      ...object,
      code: key, // Disabled for now.
      path: `$.${MICROSERVICE_NAME}.${key}`, // Path does not seem to work (Hasura 2.1.0)
      // Add hasura thingy to output
      extensions: {
        code: key,
        path: `$.${MICROSERVICE_NAME}.${key}`,
      },
    };

    if (overrideByReference) {
      // Hack to enhance original object also! Through the reference
      // eslint-disable-next-line no-param-reassign
      ERRORS_IN[key] = {
        ...object,
        code: key, // Disabled for now.
        path: `$.${MICROSERVICE_NAME}.${key}`, // Path does not seem to work (Hasura 2.1.0)
        // Add hasura thingy to output
        extensions: {
          code: key,
          path: `$.${MICROSERVICE_NAME}.${key}`,
        },
      };

      if (implementToStringPrototype) {
        // eslint-disable-next-line no-param-reassign
        ERRORS_IN[key].toString = function messageToString() {
          return JSON.stringify(this);
          // return JSON.stringify(this, null, 2);
        };
      }
    }

    return acc;
  }, {});

  return NEW_ERRORS;
};

// Idea of the errorDescriptor is to stringify all the data in the
// Error.message so that it can be parsed and passed to the special ErrorHandlers
// that need aditional data.

export const errorDescriptor = (errorObject) => {
  // Check if errorObject has special handler function if it does execute it!
  const handlerFunction = errorObject?.handler;
  if (typeof handlerFunction === 'function') {
    try {
      handlerFunction(errorObject);
    } catch (error) {
      console.error(
        '[META-ERROR]: Not only that your error has occured, but your "error handler function" also caused error'
      );
    }
  }

  return JSON.stringify(errorObject);
};

export const ERROR_NAMESPACING = [];

export const createErrorDescriptor = (NORMAL_ERRORS_OBJECT, MICROSERVICE_NAME = '') => {
  const enhacnedErrors = errorObjectEnahancer(NORMAL_ERRORS_OBJECT, MICROSERVICE_NAME);

  ERROR_NAMESPACING.push({
    microservice_name: MICROSERVICE_NAME,
    errors: enhacnedErrors,
  });

  return errorDescriptor;
};
