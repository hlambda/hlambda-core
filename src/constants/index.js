import { createConstantsDescriptor, getEnvValue, isEnvTrue } from 'hlambda';

// --- START SAFE TO EDIT ---

export const constantsGroupName = 'hlambda-main';

export const constants = {
  // Env variables
  ENV_NODE_ENV: {
    name: 'NODE_ENV',
    default: 'development',
    description: 'Node.js environment variable',
  },
  ENV_DOTENV_PATH: {
    name: 'DOTENV_PATH',
    default: undefined,
    description: 'Full path to the .env file',
  },
  ENV_DISABLE_COLORS_IN_STDOUT: {
    name: 'DISABLE_COLORS_IN_STDOUT',
    default: 'false',
    description: 'Set to true if you want to disable colorful output to stdout, it helps if you use AWS CloudWatch',
  },
  ENV_LOG_LEVELS: {
    name: 'LOG_LEVELS',
    default: 'critical,normal,verbose',
    description: 'Sets up logging level: critical, normal, verbose',
  },

  // Cluster
  ENV_NODE_APP_INSTANCE: {
    name: 'NODE_APP_INSTANCE',
    default: undefined,
    description:
      'Used in PM2, it is the name of the instance in a cluster. It is undefined if instance is not in PM2 cluster.',
  },
  ENV_MICROSERVICE_CI_CD_TOKEN: {
    name: 'MICROSERVICE_CI_CD_TOKEN',
    default: undefined,
    description: 'Used in when checking valid restart token, or for other CI/CD things.',
  },

  // Server
  ENV_SERVER_PORT: {
    name: 'SERVER_PORT',
    default: '4005',
    description: 'Server port on which express app will be hosted',
  },
  ENV_SERVER_SOURCE_IP: {
    name: 'SERVER_SOURCE_IP',
    default: '0.0.0.0',
    description: 'Server source ip on which express app will be listening',
  },
  ENV_MICROSERVICE_NAME: {
    name: 'MICROSERVICE_NAME',
    default: 'hlambda',
    description: 'Used in fetching microservice specific configuration and inside error messages.',
  },
  ENV_PRIVATE_KEY_CONFIGURATION: {
    name: 'PRIVATE_KEY_CONFIGURATION',
    default: '__INSERT_YOUR_PRIVATE_KEY_CONFIGURATION__',
    description:
      'This is stringified JSON that contains privateKeyPassword, privateKey and optionaly publicKey base64 encoded PEM. (Use /setup route to generate one if needed)',
  },
  ENV_SERVER_BODY_SIZE: {
    name: 'SERVER_BODY_SIZE',
    default: '2mb',
    description:
      'Server max allowed body size from client that express app will support. (Main usecase is Apple Subscription Notifications)',
  },

  ENV_SERVER_HEALTH: {
    name: 'SERVER_HEALTH',
    default: 'Healthy',
    description:
      'Server health that can change based on different events "Healthy", "Degraded", "Unhealthy", "Advisory"',
  },

  ENV_HLAMBDA_ADMIN_SECRET: {
    name: 'HLAMBDA_ADMIN_SECRET',
    default: '',
    description: 'Master password for API management.',
  },
  ENV_HLAMBDA_DISABLE_ADMIN_SECRET: {
    name: 'HLAMBDA_DISABLE_ADMIN_SECRET',
    default: 'false',
    description: 'Is master password for API management enabled or disabled.',
  },
  ENV_HLAMBDA_DISABLE_CONSOLE: {
    name: 'HLAMBDA_DISABLE_CONSOLE',
    default: 'false',
    description: 'Is master password for API management enabled or disabled.',
  },
  ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS: {
    name: 'HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS',
    default: '1331',
    description: 'Debounce ms time to wait before closing the server and reloading metadata.',
  },
  ENV_HLAMBDA_LOADED_APPS_PREFIX: {
    name: 'HLAMBDA_LOADED_APPS_PREFIX',
    default: '/api/v1/',
    description: 'Debounce ms time to wait before closing the server and reloading metadata.',
  },
  ENV_HLAMBDA_ENABLE_PUBLIC_SWAGGER: {
    name: 'HLAMBDA_ENABLE_PUBLIC_SWAGGER',
    default: 'false',
    description: 'Flag to enable public swagger on /docs.',
  },
  ENV_HLAMBDA_PUBLIC_SWAGGER_ROUTE: {
    name: 'HLAMBDA_ENABLE_PUBLIC_SWAGGER',
    default: '/docs',
    description: 'Flag to map swagger route, default `/docs`.',
  },

  // Constants used for any other purpose in the code.
  PING: {
    name: 'PING',
    // 'value': 'PING', // If not set undefined is presumed.
    // 'default': undefined,
  },

  // Server health statuses
  SERVER_HEALTH_HEALTHY: {
    name: 'HEALTHY',
  },
  SERVER_HEALTH_DEGRADED: {
    name: 'DEGRADED',
  },
  SERVER_HEALTH_UNHEALTHY: {
    name: 'UNHEALTHY',
  },
  SERVER_HEALTH_ADVISORY: {
    name: 'ADVISORY',
  },

  // Events
  EVENT_LOGIN_ATTEMPT: {
    name: 'LOGIN_ATTEMPT',
  },
  EVENT_LOGIN_SUCCESSFUL: {
    name: 'LOGIN_SUCCESSFUL',
  },
  EVENT_LOGIN_UNSUCCESSFUL: {
    name: 'LOGIN_UNSUCCESSFUL',
  },
};

// --- STOP SAFE TO EDIT ---

const enhancedConstants = createConstantsDescriptor(constants, constantsGroupName);

export { enhancedConstants, getEnvValue, isEnvTrue };

export default { constants, enhancedConstants, getEnvValue, isEnvTrue };
