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
import swaggerUi from 'swagger-ui-express';

import path from 'path';
import figlet from 'figlet';

import consoleOutputBuffer from './utils/loggerOverride.js';

import routeLanding from './routes/landing.js';
import middlewareProtector from './routes/protector.js';
// import routeConsole from './routes/console.js';
import route404 from './routes/404.js';
import hasuraErrorHandler from './routes/hasuraErrorHandler.js';
// import requestTimeLogger from './utils/requestTimer.js';

import generateDotEnvFileFromConsts from './utils/generateDotEnvFileFromConsts.js';
import swaggerDarkThemeCss from './utils/swaggerDarkThemeCss.js';
import swaggerDocumentGenerator from './utils/generateSwaggerConfig.js';

import { constants, isEnvTrue, getEnvValue } from './constants/index.js';

import routes from './routes/index.js';
// --------------------------------------------------------------------------------
if (isEnvTrue(constants.ENV_DISABLE_COLORS_IN_STDOUT)) {
  colors.disable();
} else {
  colors.enable();
}
// --------------------------------------------------------------------------------
// Clear the console
console.log(`\x1Bc${Array(80 + 1).join('#').yellow}`);
console.log(
  figlet.textSync('Hlambda', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  })
);
console.log(`${Array(80 + 1).join('#').yellow}`);
console.log(`- Node.js v${process.versions.node}!`.green);
// --------------------------------------------------------------------------------
const spinServer = async () => {
  // --------------------------------------------------------------------------------
  console.log('Starting hlambda server!'.green);
  console.log(`${Array(80 + 1).join('#').yellow}`);
  // Start the process of initialisation...
  const SERVER_PORT = process.env?.SERVER_PORT ?? 1331;
  // const SERVER_VERSION = process.env?.SERVER_VERSION ?? 1;

  const HLAMBDA_DISABLE_CONSOLE = isEnvTrue(constants.ENV_HLAMBDA_DISABLE_CONSOLE);
  // --------------------------------------------------------------------------------
  // Actually create .env.example file from constants
  await generateDotEnvFileFromConsts()
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
  // --------------------------------------------------------------------------------
  const app = express();
  // --------------------------------------------------------------------------------
  // Disable Express header powered by.
  app.disable('x-powered-by');

  // Add JSON body parser.
  app.use(express.json());

  // Allow cors everywhere, it make sense for this usecase, unsafe otherwise!
  app.use(cors());

  if (!HLAMBDA_DISABLE_CONSOLE) {
    // Serve static
    app.use(express.static('public'));

    // Load main route (Should redirect to console)
    app.use('/', routeLanding);

    // Load console routes
    app.use('/console/api/', middlewareProtector); // !!! IMPORTANT !!!

    // // Time all requests.
    // app.use('/console/api/', requestTimeLogger);
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
  // Load apps
  // - Load configs
  console.log(`Loading apps 'hlambda-config.yaml' configs...`.yellow);
  const fileNameConfig = path.resolve('./src/loaders/config-apps-loader.js');
  const { default: userConfigs } = await import(`file:///${fileNameConfig}`); // Notice the default

  for (const config in userConfigs) {
    if ({}.hasOwnProperty.call(userConfigs, config)) {
      const singleAppConfig = userConfigs[config]; // Single config object of yaml parsed app config
      const newSoftEnv = singleAppConfig?.env ?? {};
      for (const [key, value] of Object.entries(newSoftEnv)) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
          process.env[key] = value;
          console.log(`"${key}" is not defined in \`process.env\` and will not be overwritten`.green);
        } else {
          // process.env[key] = value; // Important to stay commented!
          console.log(`"${key}" is already defined in \`process.env\` and will not be overwritten`.yellow);
        }
      }
      const newHardEnv = singleAppConfig?.envForce ?? {};
      for (const [key, value] of Object.entries(newHardEnv)) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
          process.env[key] = value;
          console.log(`"${key}" is not defined in \`process.env\` and will not be overwritten`.green);
        } else {
          process.env[key] = value;
          console.log(
            `"${key}" is already defined in \`process.env\` and will be overwritten (because of the forced env config)!`
              .red
          );
        }
      }
    }
  }

  const loadedAppsRouterPrefix = getEnvValue(constants.ENV_HLAMBDA_LOADED_APPS_PREFIX);
  // - Load routes
  console.log(`Loading apps 'router.*.js' routes...`.yellow);
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
  // --------------------------------------------------------------------------------
  // Swagger
  const enablePublicSwagger = isEnvTrue(constants.ENV_HLAMBDA_ENABLE_PUBLIC_SWAGGER);
  const publicSwaggerRoute = getEnvValue(constants.ENV_HLAMBDA_PUBLIC_SWAGGER_ROUTE);
  const swaggerOptions = {
    explorer: false,
    customCss: `.swagger-ui .topbar { display: none } .swagger-ui .info { display: none }${swaggerDarkThemeCss}`,
    customJs: './swagger-custom-hlambda-script.js',
  };
  if (enablePublicSwagger) {
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
        swaggerOptions
      )
    );
  }
  if (!HLAMBDA_DISABLE_CONSOLE) {
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
    // Fallback to the index.html on any 404, due to hosting SPA
    app.use(
      '/console',
      fallback('index.html', {
        root: `./public/console`,
      })
    );
  }
  // --------------------------------------------------------------------------------
  // Handle 404 routes.
  app.use(route404);
  // !!! Important !!! Error handler.
  app.use(hasuraErrorHandler);
  // --------------------------------------------------------------------------------
  // Start listening on a single instance.
  const server = app.listen(SERVER_PORT, () => {
    console.log(`${Array(80 + 1).join('#').yellow}`);
    console.log(`Server listening at port: ${`${SERVER_PORT}`.yellow}`.green);
    console.log(`${Array(80 + 1).join('#').yellow}`);
  });
  // --------------------------------------------------------------------------------
  return server;
};
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
// let serverInstance = await spinServer();
// // --------------------------------------------------------------------------------
// const serverReloader = () => {
//   setTimeout(() => {
//     console.log('Trigger me!');
//     serverInstance.close(async () => {
//       console.log('Server closed');
//       serverInstance = await spinServer();
//       serverReloader();
//     });
//   }, 10000);
// };
// serverReloader();
