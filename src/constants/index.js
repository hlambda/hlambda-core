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
    description: 'Set to true if you want to disable colorful output to stdout, it helps if you use AWS CloudWatch.',
  },
  ENV_JSON_STDOUT: {
    name: 'JSON_STDOUT',
    default: 'false',
    description: 'Set to true if you want to get JSON output to stdout, it helps if you use AWS CloudWatch.',
  },
  ENV_LOG_LEVELS: {
    name: 'LOG_LEVELS',
    default: 'critical,normal,verbose',
    description: 'Sets up logging level: critical, normal, verbose',
  },
  ENV_LOG_HISTORY_BUFFER_SIZE: {
    name: 'LOG_HISTORY_BUFFER_SIZE',
    default: '255',
    description:
      'Sets up logging history buffer size. It is a max length of the history buffer, every record is the call of log function, that can contain multi-line text. (Default: 255)',
  },
  ENV_EXPRESS_REQUEST_LOG_HISTORY_BUFFER_SIZE: {
    name: 'EXPRESS_REQUEST_LOG_HISTORY_BUFFER_SIZE',
    default: '255',
    description:
      'Sets up logging history buffer size. It is a max length of the history buffer, every record is the record of the request. (Default: 255)',
  },
  ENV_ENABLE_REQUEST_HISTORY: {
    name: 'ENABLE_REQUEST_HISTORY',
    default: 'false',
    description:
      'Enables request history, useful if you want to log the last n requests and be able to replay the request. (Default: false)',
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
    default: '1331',
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
  ENV_SERVER_BODY_SIZE_ADMIN_CONSOLE: {
    name: 'SERVER_BODY_SIZE_ADMIN_CONSOLE',
    default: '50mb',
    description: 'Server max allowed body size from client that express app will support for admin console.',
  },
  ENV_DISABLE_EXPRESS_BODY_PARSER: {
    name: 'DISABLE_EXPRESS_BODY_PARSER',
    default: 'false',
    description: 'The Express body parser will be disabled for all routes except the ones required for Console.',
  },
  ENV_EXPRESS_BODY_PARSER_INCLUDE_RAW_BODY: {
    name: 'EXPRESS_BODY_PARSER_INCLUDE_RAW_BODY',
    default: 'false',
    description: 'In all requests you will have req.rawBody buffer available.',
  },
  ENV_DISABLE_EXPRESS_COOKIE_PARSER: {
    name: 'DISABLE_EXPRESS_COOKIE_PARSER',
    default: 'false',
    description: 'The Express cookie parser will be disabled for all routes except the ones required for Console.',
  },

  ENV_HLAMBDA_CORS_DOMAIN: {
    name: 'HLAMBDA_CORS_DOMAIN',
    default: '*',
    description:
      'By default, all CORS requests to the Hlambda server are allowed. To run with more restrictive CORS settings, use this env variable. Example: `https://*.foo.bar.com:8080, http://*.localhost, http://localhost:3000, http://example.com`',
  },

  ENV_SERVER_HEALTH: {
    name: 'SERVER_HEALTH',
    default: 'Healthy',
    description:
      'Server health that can change based on different events "Healthy", "Degraded", "Unhealthy", "Advisory"',
  },

  ENV_HLAMBDA_ADMIN_SECRET: {
    name: 'HLAMBDA_ADMIN_SECRET',
    default: 'you-must-change-me', // Default value
    description: 'Master password for API management.',
  },
  ENV_HLAMBDA_DISABLE_ADMIN_SECRET: {
    name: 'HLAMBDA_DISABLE_ADMIN_SECRET',
    default: 'false',
    description: 'Disables or enables master password for API management.',
  },
  ENV_HLAMBDA_DISABLE_CONSOLE: {
    name: 'HLAMBDA_DISABLE_CONSOLE',
    default: 'false',
    description: 'Completely disables Console and Console API thus any metadata update.',
  },
  ENV_HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT: {
    name: 'HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT',
    default: 'false',
    description: 'Disable 301 redirect from the root path to the `/console`.',
  },
  ENV_HLAMBDA_DISABLE_CONSOLE_FRONTEND: {
    name: 'HLAMBDA_DISABLE_CONSOLE_FRONTEND',
    default: 'false',
    description: "Disable static serving of the frontend artefacts from hlambda's public folder.",
  },
  ENV_HLAMBDA_CONSOLE_ASSETS_DIR: {
    name: 'HLAMBDA_CONSOLE_ASSETS_DIR',
    default: 'public',
    description:
      'If set it will serve console assets from that directory instead of CDN. Using CDN enables system to have lates UI and receive Console hotfixes without the need for updating image.',
  },
  ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS: {
    name: 'HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS',
    default: '1331',
    description: 'Debounce ms time to wait before closing the server and reloading metadata.',
  },
  ENV_HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS: {
    name: 'HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS',
    default: '0',
    description:
      'Graceful shutdown delay in ms, time to wait before closing the server (Used to give some time to the app to finish all processes after SIGINT).',
  },
  ENV_HLAMBDA_LOADED_APPS_PREFIX: {
    name: 'HLAMBDA_LOADED_APPS_PREFIX',
    default: '', // We host everything to root, but we give option to user to set prefix.
    // default: '/api/v1/',
    description: 'Prefix used for all the loaded router apps.',
  },
  ENV_HLAMBDA_ENABLE_PUBLIC_SWAGGER: {
    name: 'HLAMBDA_ENABLE_PUBLIC_SWAGGER',
    default: 'false',
    description: 'Flag to enable public swagger on /docs.',
  },
  ENV_HLAMBDA_PUBLIC_SWAGGER_ROUTE: {
    name: 'HLAMBDA_PUBLIC_SWAGGER_ROUTE',
    default: '/docs',
    description: 'Flag to map swagger route, default `/docs`.',
  },
  ENV_HLAMBDA_SWAGGER_UI_TOKEN_EXPIRES_IN_SECONDS: {
    name: 'HLAMBDA_SWAGGER_UI_TOKEN_EXPIRES_IN_SECONDS',
    default: '86400', // 24 * 3600 = 1d = 86400s
    description: 'Expires in value in seconds, time before JWT token expires and cookie is deleted on the client.',
  },
  ENV_HLAMBDA_VSCODE_UI_TOKEN_EXPIRES_IN_SECONDS: {
    name: 'HLAMBDA_VSCODE_UI_TOKEN_EXPIRES_IN_SECONDS',
    default: '86400', // 24 * 3600 = 1d = 86400s
    description: 'Expires in value in seconds, time before JWT token expires and cookie is deleted on the client.',
  },

  // GitOps
  ENV_ENABLE_HLAMBDA_GIT_SYNC: {
    name: 'ENABLE_HLAMBDA_GIT_SYNC',
    default: 'false',
    description:
      'Turns on the GIT SYNC option, where the server will be able to sync metadata with remote repository. (Default: false)',
  },
  ENV_HLAMBDA_GIT_SYNC_URL: {
    name: 'HLAMBDA_GIT_SYNC_URL',
    default: '',
    description: 'Sync repository url.',
  },
  ENV_HLAMBDA_GIT_SYNC_USERNAME: {
    name: 'HLAMBDA_GIT_SYNC_USERNAME',
    default: '',
    description: 'Sync repository username.',
  },
  ENV_HLAMBDA_GIT_SYNC_PASSWORD: {
    name: 'HLAMBDA_GIT_SYNC_PASSWORD',
    default: '',
    description: 'Sync repository password.',
  },
  ENV_HLAMBDA_GIT_SYNC_BRANCH: {
    name: 'HLAMBDA_GIT_SYNC_BRANCH',
    default: 'master',
    description: 'Sync default branch. (Default: master) If falsey value, the current HEAD branch will be used.',
  },
  ENV_HLAMBDA_GIT_SYNC_INTERVAL_SECONDS: {
    name: 'HLAMBDA_GIT_SYNC_INTERVAL_SECONDS',
    default: '240',
    description:
      'When sync is enabled, system will automatically try to sync with the current branch, it will work only if there is no conflicts, to not destroy live work. (Default: 240 (4m). If set to 0, disables pooling)',
  },
  ENV_HLAMBDA_GIT_SYNC_COMMAND: {
    name: 'HLAMBDA_GIT_SYNC_COMMAND',
    default: 'git pull',
    description: 'This command will run when sync is executed. (Default: git pull)',
  },

  // Loader configurations
  ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX: {
    name: 'HLAMBDA_CONFIGURATION_LOADER_PREFIX',
    default: 'hlambda-config.yaml',
    description: 'Sets the value for the name of the configuration file that will be loaded.',
  },
  ENV_HLAMBDA_EXPRESS_LOADER_PREFIX: {
    name: 'HLAMBDA_EXPRESS_LOADER_PREFIX',
    default: 'router.',
    description: 'Sets the value for the prefix of the router files that will be loaded.',
  },
  ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX: {
    name: 'HLAMBDA_ENTRYPOINT_LOADER_PREFIX',
    default: 'entrypoint.',
    description: 'Sets the value for the prefix of the entrypoint files that will be loaded.',
  },

  // Env banners
  ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER: {
    name: 'HLAMBDA_ENABLE_ENVIRONMENT_BANNER',
    default: 'false',
    description: 'Enables environment banner.',
  },
  ENV_HLAMBDA_ENVIRONMENT_BANNER_NAME: {
    name: 'HLAMBDA_ENVIRONMENT_BANNER_NAME',
    default: '',
    description: 'Sets name to the environment banner.',
  },
  ENV_HLAMBDA_ENVIRONMENT_BANNER_MESSAGE: {
    name: 'HLAMBDA_ENVIRONMENT_BANNER_MESSAGE',
    default: '',
    description: 'Sets message to the environment banner.',
  },
  ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR: {
    name: 'HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR',
    default: '#fea300',
    description: 'Selects color of the environment banner.',
  },

  // Env override blacklist
  ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES: {
    name: 'HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES',
    default: 'HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES,HLAMBDA_DISABLE_CONSOLE,HLAMBDA_ADMIN_SECRET,SERVER_PORT',
    description: 'List of the env variable names that are protected from hlambda config override.',
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
