import express from 'express';
import asyncHandler from 'express-async-handler';

import got from 'got';
import * as url from 'url';

// Create express router
const router = express.Router();

router.get(
  '/*',
  asyncHandler(async (req, res) => {
    const pathname = url.parse(req.url || '').pathname || '';
    const matches = pathname.match(/^\/api\/vscode-unpkg\/([^/]+)\/(.*)/);

    if (!matches) {
      res.status(404);
      return res.send('Not found');
    }

    const publisher = matches[1];
    const restPartsPath = matches[2];
    const requestUrl = `https://${publisher}.vscode-unpkg.net/${publisher}/${restPartsPath}`;
    const response = await got(requestUrl).catch((error) => {
      return error.response || { statusCode: 500, headers: {}, rawBody: Buffer.from(error.message) };
    });

    res.status(response.statusCode);
    ['cache-control', 'content-type'].forEach((headerKey) => {
      // eslint-disable-next-line no-unused-expressions
      response.headers[headerKey] && res.setHeader(headerKey, response.headers[headerKey]);
    });
    return res.send(response.rawBody);
  })
);
export default router;
