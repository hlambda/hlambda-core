import express from 'express';
import asyncHandler from 'express-async-handler';

// Create express router
const router = express.Router();

router.get(
  '/environments',
  asyncHandler(async (req, res) => {
    /*
      Funny story, pm2 is injecting env variables that are string [object Object]
      Can't do much about it... Maybe a PR... it seems issue is closed: https://github.com/Unitech/pm2/issues/4328
      "env": "[object Object]",
      "axm_monitor": "[object Object]",
      "axm_options": "[object Object]",
      "axm_dynamic": "[object Object]",

      This only happens if you are running process under PM2.
    */
    res.send(JSON.stringify(process.env, null, 2));
  })
);

export default router;
