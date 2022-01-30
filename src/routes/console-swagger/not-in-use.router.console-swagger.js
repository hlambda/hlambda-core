// NOT IN USE, it is deployed in index.js (The main reason is that we need this to happen on the end for swaggerDocumentGenerator to map all routes)
// Also reference to the express app is missing here...

/*
import express from 'express';
import asyncHandler from 'express-async-handler';
import swaggerUi from 'swagger-ui-express';

import swaggerDarkThemeCss from './../../utils/swaggerDarkThemeCss.js';
import swaggerDocumentGenerator from './../../utils/generateSwaggerConfig.js';

// Create express router
const router = express.Router();

const swaggerOptions = {
  explorer: false,
  customCss: `.swagger-ui .topbar { display: none } .swagger-ui .info { display: none }${swaggerDarkThemeCss}`,
  customJs: './swagger-custom-hlambda-script.js',
};

router.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerDocumentGenerator(router, {
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

export default router;
*/
