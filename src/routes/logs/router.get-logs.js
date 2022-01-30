import express from 'express';
import asyncHandler from 'express-async-handler';

import AnsiUp from 'ansi_up';

// Define errors
import errors from './../../errors/index.js';
import consoleOutputBuffer from './../../utils/loggerOverride.js';

// Create express router
const router = express.Router();

// Warning: PROTECT THIS HEAVILY!!! We do not want to leak logs

router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const outputType = req.query?.type ?? 'rich-text';

    if (outputType === 'json') {
      res.json(JSON.stringify(consoleOutputBuffer, null, 2));
    } else if (outputType === 'text') {
      res.json(consoleOutputBuffer.join('\n'));
    } else if (outputType === 'html') {
      // eslint-disable-next-line new-cap
      const ansiUp = new AnsiUp.default();
      const html = ansiUp.ansi_to_html(consoleOutputBuffer.join('\n'));
      res.send(`<pre style="background-color: #000; color: #FFF">${html}</pre>`);
    } else {
      // eslint-disable-next-line new-cap
      const ansiUp = new AnsiUp.default();
      const html = ansiUp.ansi_to_html(consoleOutputBuffer.join('\n'));
      res.send(`<style>
    body {
      margin: 0;
      padding: 0;
    }
    pre {
      background-color: #000;
      color: #FFF;
      overflow-y: auto;
      padding: 0;
      height: 100vh;
      display: block;
      margin: 0;
  }</style>
  <body>
  <pre id="logs">${html}</pre>
  <script>
    var element = document.getElementById("logs");
    element.scrollTop = element.scrollHeight;
  </script>
  </body>`);
    }
  })
);

export default router;
