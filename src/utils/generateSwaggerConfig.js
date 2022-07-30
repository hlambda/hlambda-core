import listEndpoints from 'express-list-endpoints';

const findExpressRoutes = (app) => {
  let route = [];
  const routes = [];

  // eslint-disable-next-line no-underscore-dangle
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      // router middleware
      middleware.handle.stack.forEach((handler) => {
        console.log(handler);
        route = handler.route;
        if (route) {
          routes.push(route);
        }
      });
    }
  });
  return routes;
};
// console.log(JSON.stringify(findExpressRoutes(app), null, 2));

const swaggerDocumentGenerator = (app, API_DEFINITION) => {
  // const routes = findExpressRoutes(app);

  const routes = listEndpoints(app);

  const routesForSwagger = routes.reduce((acc, item) => {
    const { path } = item;

    // There is an issue with .all middlewares, it does not work, the result from 'express-list-endpoints' is empty array
    const methods = item.methods?.length === 0 ? ['GET', 'POST', 'PUT', 'DELETE'] : item.methods;

    // Object.keys(methods).reduce((accMethods, methodKey) => {
    //   const methodVal = methods[methodKey];
    //   if (methodVal) {
    //     accMethods[methodKey] = {
    //       tags: ['Custom'],
    //       parameters: (methodKey === 'POST') ? [{
    //         in: 'body',
    //         name: `${path} body`,
    //         schema: {
    //             type: 'object',
    //         },
    //       }] : [],
    //       responses: {
    //       },
    //     };
    //   }
    //   return accMethods;
    // }, {})

    acc[path] = {
      ...methods.reduce((accMethods, methodItem) => {
        const methodName = methodItem.toLowerCase();
        // eslint-disable-next-line no-param-reassign
        accMethods[methodName] = {
          tags: [path.startsWith('/console/') ? 'Hlambda Console' : 'Custom'], // Anything hosted in /console/ should be Hlambda Console
          security: [
            path.startsWith('/console/')
              ? {
                  APIKeyHeader: [],
                }
              : {},
          ],
          parameters:
            methodName === 'post'
              ? [
                  {
                    in: 'body',
                    name: `${path} body`,
                    schema: {
                      type: 'object',
                    },
                  },
                ]
              : [],
          responses: {},
        };
        return accMethods;
      }, {}),
    };
    return acc;
  }, {});

  const swaggerObject = {
    swagger: '2.0',
    info: {
      version: `${API_DEFINITION.apiVersion}`,
      title: `${API_DEFINITION.apiName}`,
      description: `${API_DEFINITION.apiDescription}`,
    },
    produces: ['application/json'],
    // schemes: [
    //     'https',
    //     'http',
    // ],
    // "host": "localhost:8080",
    // basePath: '/api/v1.0',
    tags: [],
    // securityDefinitions: {
    //   jwt: {
    //     type: 'apiKey',
    //     in: 'header',
    //     name: 'Authorization',
    //   },
    // },
    securityDefinitions: {
      APIKeyHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-hlambda-admin-secret',
      },
    },
    paths: {
      ...routesForSwagger,
    },
  };

  return swaggerObject;
};

export default swaggerDocumentGenerator;
