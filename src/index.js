// --------------------------------------------------------------------------------
/*
             ██   ██ ██       █████  ███    ███ ██████  ██████   █████
            ██   ██ ██      ██   ██ ████  ████ ██   ██ ██   ██ ██   ██
           ███████ ██      ███████ ██ ████ ██ ██████  ██   ██ ███████
          ██   ██ ██      ██   ██ ██  ██  ██ ██   ██ ██   ██ ██   ██
         ██   ██ ███████ ██   ██ ██      ██ ██████  ██████  ██   ██
*/
// --------------------------------------------------------------------------------
import 'dotenv/config';
import colors from 'colors';
import express from 'express';
import fallback from 'express-history-api-fallback';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import path from 'path';
import figlet from 'figlet';
import textFormatter from 'output-text-formatter';

// Override console output.
import './utils/loggerOverride.js';

import routeLanding from './routes/landing.js';
import middlewareProtector from './routes/protector.js';
import swaggerUIMiddlewareProtector from './routes/swaggerUIProtector.js';
import vscodeUIMiddlewareProtector from './routes/vscodeUIProtector.js';
import vscodeProxy from './routes/console-vscode/unprotected-router.console-vscode-ui-proxy.js';

import route404 from './routes/404.js';
import hasuraErrorHandler from './routes/hasuraErrorHandler.js';
import healthzRouter from './routes/health/public-router.healthz.js';
import expressRequestHistoryRecorderMiddleware from './utils/expressRequestHistoryRecorderMiddleware.js';

import generateDotEnvFileFromConsts from './utils/generateDotEnvFileFromConsts.js';
import swaggerDarkThemeCss from './utils/swaggerDarkThemeCss.js';
import swaggerDocumentGenerator from './utils/generateSwaggerConfig.js';
import swaggerCustomUIJS from './routes/swagger-custom-js-payload.js';

import { constants, isEnvTrue, getEnvValue } from './constants/index.js';

import routes from './routes/index.js';
import getProcessInstanceId from './utils/getProcessInstanceId.js';
import readPackageVersion from './utils/readPackageVersion.js';
import execScriptCommand from './utils/execScriptCommand.js';

// Create Hlambda event emmitter
import hlambdaEventEmitter from './emitter/index.js';

// Import git sync
import { startGitSync } from './utils/gitSync.js';

// Customized npm packages
import swaggerUi from './custom/swagger-ui-express/index.js';
// --------------------------------------------------------------------------------
// Set global Hlambda's event emitter
global.hlambdaEventEmitter = hlambdaEventEmitter;

// Spread textFormatter
const { centerText } = textFormatter;
// --------------------------------------------------------------------------------
if (isEnvTrue(constants.ENV_DISABLE_COLORS_IN_STDOUT)) {
  colors.disable();
} else {
  colors.enable();
}
// --------------------------------------------------------------------------------
const processInstanceId = await getProcessInstanceId()
  .then((result) => {
    return result;
  })
  .catch((error) => {
    console.log(error);
    return '-';
  });
// Assign process.processInstanceId to the id, so it can be accessed from Hlapp's
process.processInstanceId = processInstanceId;
// Clear the console
console.log(`\x1Bc${Array(80 + 1).join('#').yellow}`);
console.log(
  centerText(
    `\n${figlet.textSync('hlambda', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })}\n`.green
  )
);
console.log(`${Array(80 + 1).join('#').yellow}`);
console.log(`- Node.js version: v${process.versions.node}`.green);
// --------------------------------------------------------------------------------
const spinServer = async () => {
  // --------------------------------------------------------------------------------
  const getPackageVersion = await readPackageVersion()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
      return '-';
    });
  // console.log('- Starting hlambda server!'.green);
  console.log(`- Hlambda server version: v${getPackageVersion}`.green);
  console.log(`- Process instance id: ${processInstanceId}`.green);
  console.log(`${Array(80 + 1).join('#').yellow}`);
  // --------------------------------------------------------------------------------
  // Actually create .env.example file from constants
  await generateDotEnvFileFromConsts()
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
  // --------------------------------------------------------------------------------
  /*
    Important to note, only at this point we are actually reading config, so any env change will be effective after this point,
    it can't be effective before, thus; ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX is the one that can't be changed by the config name.
    Same situation is for the: HLAMBDA_DISABLE_CONSOLE and HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT
  */
  const ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES = getEnvValue(
    constants.ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES
  );
  const ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX = getEnvValue(constants.ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX);
  // - Load configs
  console.log(`Loading apps '${ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX}' configurations...`.yellow);
  const fileNameConfig = path.resolve('./src/loaders/config-apps-loader.js');
  const { default: userConfigs, loadedConfigsPathsAndMetadata } = await import(`file:///${fileNameConfig}`); // Notice the default

  console.log(`${Array(80 + 1).join('-').yellow}`);
  console.log('Processing configurations and environment variables...'.yellow);
  console.log(
    `Protected environment variables are:`.green,
    `${ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES.split(',').join(', ')}`.yellow
  );

  for (const config in userConfigs) {
    if ({}.hasOwnProperty.call(userConfigs, config)) {
      const singleAppConfig = userConfigs[config]; // Single config object of yaml parsed app config
      const newSoftEnv = singleAppConfig?.env ?? {};
      const singleAppConfigMetadata = loadedConfigsPathsAndMetadata[config];

      // Check for enabled:false
      if (`${singleAppConfig?.enabled}`.toLowerCase() === 'false') {
        console.log('App disabled:'.red, `${singleAppConfigMetadata.path}`.yellow);
      } else {
        // Enabled flag is not false, we will do the steps in this config file
        // Inject environment variables
        for (const [key, value] of Object.entries(newSoftEnv)) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            if (ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES.split(',').includes(key)) {
              console.log(
                `[env] "${key}" is not defined in \`process.env\` and will not be added from ${config}. (Because it is protected)`
                  .red
              );
            } else {
              process.env[key] = value;
              console.log(`[env] "${key}" is not defined in \`process.env\` and will be added from ${config}.`.green);
            }
          } else {
            // process.env[key] = value; // Important to stay commented!
            console.log(
              `[env] "${key}" is already defined in \`process.env\` and will not be added/overwritten from ${config}.`
                .yellow
            );
          }
        }
        const newHardEnv = singleAppConfig?.envForce ?? {};
        for (const [key, value] of Object.entries(newHardEnv)) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            if (ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES.split(',').includes(key)) {
              console.log(
                `[forceEnv] "${key}" is not defined in \`process.env\` and will not be overwritten from ${config}. (Because it is protected)`
                  .red
              );
            } else {
              process.env[key] = value;
              console.log(
                `[forceEnv] "${key}" is not defined in \`process.env\` and will be overwritten from ${config} (because of the forced env config)!`
                  .red
              );
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES.split(',').includes(key)) {
              console.log(
                `[forceEnv] "${key}" is already defined in \`process.env\` and will not be overwritten from ${config}. (Because it is protected)`
                  .red
              );
            } else {
              process.env[key] = value;
              console.log(
                `[forceEnv] "${key}" is already defined in \`process.env\` and will be overwritten from ${config} (because of the forced env config)!`
                  .red
              );
            }
          }
        }

        // Execute postReloadScripts
        const postReloadScripts = singleAppConfig?.postReloadScripts ?? [];
        if (Array.isArray(postReloadScripts) && postReloadScripts.length > 0) {
          console.log('App contains postReloadScripts:'.red, `${singleAppConfigMetadata.path}`.yellow);
          for (const item of postReloadScripts) {
            console.log('Executing:'.red, `${item}`.yellow);
            // eslint-disable-next-line no-await-in-loop
            await execScriptCommand(item);
          }
        }
      }
    }
  }
  // --------------------------------------------------------------------------------
  // Start the process of initialisation...
  // const SERVER_VERSION = getEnvValue(constants.ENV_SERVER_VERSION);
  const HLAMBDA_DISABLE_CONSOLE = isEnvTrue(constants.ENV_HLAMBDA_DISABLE_CONSOLE);
  const HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT = isEnvTrue(constants.ENV_HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT);
  const HLAMBDA_CONSOLE_ASSETS_DIR = getEnvValue(constants.ENV_HLAMBDA_CONSOLE_ASSETS_DIR);
  const HLAMBDA_DISABLE_CONSOLE_FRONTEND = isEnvTrue(constants.ENV_HLAMBDA_DISABLE_CONSOLE_FRONTEND);
  const HLAMBDA_CORS_DOMAIN = getEnvValue(constants.ENV_HLAMBDA_CORS_DOMAIN);
  // --------------------------------------------------------------------------------
  const app = express();
  // --------------------------------------------------------------------------------
  // Disable Express header powered by.
  app.disable('x-powered-by');
  // --------------------------------------------------------------------------------
  // Allow cors everywhere, it make sense for this usecase, unsafe otherwise!
  app.use(cors({ origin: HLAMBDA_CORS_DOMAIN }));
  // --------------------------------------------------------------------------------
  if (!HLAMBDA_DISABLE_CONSOLE) {
    if (!HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT) {
      // Load main route (Should redirect to console)
      app.use('/', routeLanding);
    }

    // Load console routes
    app.use('/console/api/', middlewareProtector); // !!! IMPORTANT !!!

    // // Time all requests.
    // app.use('/console/api/', requestTimeLogger);
  }
  // --------------------------------------------------------------------------------
  // Add cookie parser
  if (isEnvTrue(constants.ENV_DISABLE_EXPRESS_COOKIE_PARSER)) {
    // We only include cookie parser for console, we need it there for Swagger UI ACL.
    app.use('/console/', cookieParser());
  } else {
    // By default use it everywhere it is not expensive to have that enabled and it is really useful.
    app.use(cookieParser());
  }

  const SERVER_BODY_SIZE = getEnvValue(constants.ENV_SERVER_BODY_SIZE);
  const SERVER_BODY_SIZE_ADMIN_CONSOLE = getEnvValue(constants.ENV_SERVER_BODY_SIZE_ADMIN_CONSOLE);
  // Add JSON body parser.
  if (isEnvTrue(constants.ENV_DISABLE_EXPRESS_BODY_PARSER)) {
    // Do not use body parser.
    // We need it only on '/console/api/'
    app.use('/console/api/', express.json({ limit: SERVER_BODY_SIZE_ADMIN_CONSOLE }));
  } else if (isEnvTrue(constants.ENV_EXPRESS_BODY_PARSER_INCLUDE_RAW_BODY)) {
    const rawBodySaver = (req, res, buffer, encoding) => {
      if (buffer && buffer?.length) {
        req.rawBody = `${buffer?.toString(encoding || 'utf8')}`;
      }
    };
    app.use(
      '/console/api/',
      express.json({
        verify: rawBodySaver,
        limit: SERVER_BODY_SIZE_ADMIN_CONSOLE,
      })
    ); // File upload has to have bigger payloads
    app.use(
      express.json({
        verify: rawBodySaver,
        limit: SERVER_BODY_SIZE,
      })
    ); // Normal size payload
  } else {
    app.use('/console/api/', express.json({ limit: SERVER_BODY_SIZE_ADMIN_CONSOLE })); // File upload has to have bigger payloads
    app.use(express.json({ limit: SERVER_BODY_SIZE })); // Normal size payload
  }
  // --------------------------------------------------------------------------------
  if (!HLAMBDA_DISABLE_CONSOLE) {
    // eslint-disable-next-line no-restricted-syntax
    for (const route in routes) {
      if ({}.hasOwnProperty.call(routes, route)) {
        app.use('/console/api/v1/', routes[route].default); // Notice the default
      }
    }
    app.use('/console/api/', route404);

    // Before swagger we fallback to all "console/" requsts to console/index.html, now that is done at the end.
  }
  // --------------------------------------------------------------------------------
  const ENABLE_REQUEST_HISTORY = isEnvTrue(constants.ENV_ENABLE_REQUEST_HISTORY);
  if (ENABLE_REQUEST_HISTORY) {
    app.use(expressRequestHistoryRecorderMiddleware);
  }
  // --------------------------------------------------------------------------------
  // Load apps
  console.log(`${Array(80 + 1).join('-').yellow}`);
  const ENV_HLAMBDA_EXPRESS_LOADER_PREFIX = getEnvValue(constants.ENV_HLAMBDA_EXPRESS_LOADER_PREFIX);
  const loadedAppsRouterPrefix = getEnvValue(constants.ENV_HLAMBDA_LOADED_APPS_PREFIX);
  // - Load routes
  console.log(`Loading apps '${ENV_HLAMBDA_EXPRESS_LOADER_PREFIX}*.js' routes...`.yellow);
  const fileName = path.resolve('./src/loaders/router-apps-loader.js');
  const { default: userRoutes } = await import(`file:///${fileName}`); // Notice the default
  // eslint-disable-next-line no-restricted-syntax
  for (const route in userRoutes) {
    if ({}.hasOwnProperty.call(userRoutes, route)) {
      if (userRoutes[route]?.default) {
        // If module errors out on loading, we need to skip router loading
        app.use(loadedAppsRouterPrefix, userRoutes[route].default); // Notice the default
      }
    }
  }

  // Load entrypoints
  console.log(`${Array(80 + 1).join('-').yellow}`);
  const ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX = getEnvValue(constants.ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX);
  // - Load entrypoints
  console.log(`Loading apps '${ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX}*.js' entrypoints...`.yellow);
  const fileNameEntrypoint = path.resolve('./src/loaders/entrypoint-apps-loader.js');
  const { default: userEntrypoints } = await import(`file:///${fileNameEntrypoint}`); // Notice the default
  // eslint-disable-next-line no-restricted-syntax
  for (const entrypoint in userEntrypoints) {
    if ({}.hasOwnProperty.call(userEntrypoints, entrypoint)) {
      if (userEntrypoints[entrypoint]?.default) {
        // If module errors out on loading, we need to skip entrypoint loading
        const theEntrypoint = userEntrypoints[entrypoint].default; // Notice the default
        // Already importet no need to execute anything...
        // if (typeof theEntrypoint === 'function') {
        //   theEntrypoint();
        // }
      }
    }
  }
  // --------------------------------------------------------------------------------
  // Swagger
  const enablePublicSwagger = isEnvTrue(constants.ENV_HLAMBDA_ENABLE_PUBLIC_SWAGGER);
  const publicSwaggerRoute = getEnvValue(constants.ENV_HLAMBDA_PUBLIC_SWAGGER_ROUTE);

  if (enablePublicSwagger) {
    const swaggerPublicOptions = {
      explorer: false,
      customCss: `.swagger-ui .topbar { display: none } .swagger-ui .info { display: none }${swaggerDarkThemeCss}`,
      // customJs: './swagger-custom-hlambda-script.js', // There is no custom js for public docker if there is one it should be different than console one.
    };
    app.use(
      publicSwaggerRoute,
      swaggerUi.serve,
      swaggerUi.setup(
        swaggerDocumentGenerator(app, {
          apiName: 'Hlambda - API',
          apiDescription: 'This is "Hlambda - API".',
          // apiVersion: 'v1.0',
          // apiVersionBase: '/v1.0',
          // apiDocumentation: '/v1.0/docs',
          apiAccepts: 'application/json',
        }),
        swaggerPublicOptions
      )
    );
  }
  if (!HLAMBDA_DISABLE_CONSOLE) {
    // Set protector to the vscode UI
    app.use('/console/vscode-payload/', vscodeUIMiddlewareProtector); // !!! IMPORTANT !!!
    app.use('/console/vscode-proxy/', vscodeUIMiddlewareProtector); // !!! IMPORTANT !!!
    app.use('/console/vscode-proxy/', vscodeProxy);
    // Before we start we need to set up protector for public swagger UI
    app.use('/console/docs/', swaggerUIMiddlewareProtector); // !!! IMPORTANT !!!
    // Define SwaggerUI options.
    const swaggerOptions = {
      explorer: false,
      customCss: `.swagger-ui .topbar { display: none } .swagger-ui .info { display: none }${swaggerDarkThemeCss}`,
      customJs: './swagger-custom-hlambda-script.js',
    };
    app.use('/console/docs', swaggerCustomUIJS);
    app.use(
      '/console/docs',
      swaggerUi.serve,
      swaggerUi.setup(
        swaggerDocumentGenerator(app, {
          apiName: 'Hlambda - API',
          apiDescription: 'This is "Hlambda - API".',
          // apiVersion: 'v1.0',
          // apiVersionBase: '/v1.0',
          // apiDocumentation: '/v1.0/docs',
          apiAccepts: 'application/json',
        }),
        swaggerOptions
      )
    );

    if (!HLAMBDA_DISABLE_CONSOLE_FRONTEND) {
      if (
        typeof HLAMBDA_CONSOLE_ASSETS_DIR === 'undefined' ||
        HLAMBDA_CONSOLE_ASSETS_DIR === '' ||
        HLAMBDA_CONSOLE_ASSETS_DIR === 'cdn'
      ) {
        // Serve from CDN
        // Security note: By default we should never serve UI by default via CDN
        // It should be done only explicit, the issue that attacker can gather RCE to any hlambda by just changing artefacts in CDN is super super dangerous.
        // I'll have to brign up the issue to Hasura team regarding defaults to CDN console.

        // For now there is no option to serve static files from CDN. CDN is not ready. As such we will continue serving local UI
        app.use(express.static('public'));
      } else {
        // Serve static
        app.use(express.static('public'));
      }

      // Fallback to the index.html on any 404, due to hosting SPA
      app.use(
        '/console',
        fallback('index.html', {
          root: `./public/console`,
        })
      );
    }
  }
  // --------------------------------------------------------------------------------
  // Add healthz route.
  app.use(healthzRouter);
  // Handle 404 routes.
  app.use(route404);
  // !!! Important !!! Error handler.
  app.use(hasuraErrorHandler);
  // --------------------------------------------------------------------------------
  console.log(`${Array(80 + 1).join('-').yellow}`);
  // Get the PORT.
  const SERVER_PORT = getEnvValue(constants.ENV_SERVER_PORT);
  // await sleep(10000); // Debug artefact to test zero-downtime reload
  // Start listening on a single instance.
  const server = app.listen(SERVER_PORT, () => {
    console.log(`${Array(80 + 1).join('#').yellow}`);
    console.log(`Server listening at port: ${`${SERVER_PORT}`.yellow}`.green);
    hlambdaEventEmitter.emit('server-listening', server); // Fire event so any app can known when we are listening.
    console.log(`${Array(80 + 1).join('#').yellow}`);
  });
  // --------------------------------------------------------------------------------
  if (isEnvTrue(constants.ENV_ENABLE_HLAMBDA_GIT_SYNC)) {
    // console.log('Git sync is starting...'.green);
    await startGitSync();
  } else {
    console.log('Git sync is disabled.'.red);
  }
  console.log(`${Array(80 + 1).join('-').yellow}`);
  // --------------------------------------------------------------------------------
  // For some packages like socket.io we need reference to the server instance to attach
  global.HLAMBDA_SERVER_INSTANCE = server; // Legacy
  hlambdaEventEmitter.emit('server-ready', server);

  // Ref: https://stackoverflow.com/a/30585632
  process.send = process.send || (() => {});
  process.send('ready');
  // --------------------------------------------------------------------------------
  // This should not be necessary at all, because when all things are done process will exit, BUT
  // Ref: https://github.com/Unitech/pm2/issues/3078 Issue is never solved, cluster processes will never exit in pm2, something is keeping it alive even when it is done.
  const HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS = parseInt(
    getEnvValue(constants.ENV_HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS),
    10
  );
  let sigIntSignalReceived = false;
  const startGracefulShutdownProcess = () => {
    // Stops the server from accepting new connections and finishes existing connections.
    if (!sigIntSignalReceived) {
      // Notice ! NOT sigIntSignalReceived
      // We want to subscribe to server.close only once, or else we will get ERR_SERVER_NOT_RUNNING for multiple SIGINT / SIGTERM
      console.log('Closing server.');
      server.close((err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log('Server closed.');
        process.exitCode = 0; // It should be 0
        // Idea behind this is that we still give a chance for background process-es to complete before killing it.
        // Example a strange timeout or worker process calling hasura, and parsing the results.
        console.log(`Closing after ${(HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS / 1000).toFixed(3)}s.`);
        // This does not make much sense, because node.js process will exit if there is nothing to do.
        // But pm2 ecosystem.config.cjs is fixed and set to 120s kill_timeout: 120000.
        // Maybe we should set this on pm2 to indefinite such that when process is done it closes. (Check issue https://github.com/Unitech/pm2/issues/3078)
        setTimeout(() => {
          console.log('Closed.');
          process.exit(0); // We are forced to do this.
        }, HLAMBDA_GRACEFUL_SHUTDOWN_DELAY_MS);
      });
    }
    sigIntSignalReceived = true;
  };
  process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    startGracefulShutdownProcess();
  });
  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    startGracefulShutdownProcess();
  });
  // --------------------------------------------------------------------------------
  return server;
};

// Returns server instance
spinServer()
  .then(() => {
    console.log(`${Array(80 + 1).join('#').yellow}`);
    console.log("Everything that didn't errored out is successfully started!".green);
  })
  .catch((error) => {
    console.log(`${Array(80 + 1).join('#').yellow}`);
    console.error('Main system error:'.red);
    console.error(error);
  });

// --------------------------------------------------------------------------------
