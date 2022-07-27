import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../errors/index.js';

// Create express router
const router = express.Router();

const payload = `

// ui.authActions.authorize({JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"}})
// Ref: https://github.com/swagger-api/swagger-ui/issues/2915#issuecomment-297405865

window.addEventListener('load', function () {
  const parsedHash = new URLSearchParams(
    decodeURIComponent(window.location.hash.substring(2)) // Skip the first char (#) and / from swagger
  );

  let secret = parsedHash.get("secret");

  if (typeof secret === 'undefined' || secret === null) {
    try {
      console.log(localStorage.getItem('console:adminSecret'));
      secret = JSON.parse(localStorage.getItem('console:adminSecret'));
    } catch(error) {
      console.log('[custom-swagger-js]', error);
    }
  }

  if (secret) {
    ui.authActions.authorize({APIKeyHeader: {name: "APIKeyHeader", schema: {type: "apiKey", in: "header", name: "x-hlambda-admin-secret", description: ""}, value: secret }})
  }
}, false);
`;

router.get(
  '/swagger-custom-hlambda-script.js',
  asyncHandler((req, res) => {
    res.send(payload);
  })
);

export default router;
