import express from 'express';
import asyncHandler from 'express-async-handler';

import { DateTime } from 'luxon';

import forge from 'node-forge';

import hasuraRequestLogger from './hasura-request-logger.js';

const { pki } = forge;
const { rsa } = forge.pki;

// Create express router
const router = express.Router();

router.use('/system/rsa', hasuraRequestLogger);

router.get(
  '/system/rsa/generate',
  asyncHandler((req, res) => {
    const keypair = rsa.generateKeyPair({
      bits: 2048,
      e: 0x10001,
    });

    const adminSecretBytes = forge.random.getBytesSync(32);
    const adminSecretBytesHex = forge.util.bytesToHex(adminSecretBytes);

    const publicKeyPEMPasswordBytes = forge.random.getBytesSync(16);
    const publicKeyPEMPasswordBytesHex = forge.util.bytesToHex(publicKeyPEMPasswordBytes);

    const privateKeyPEM = pki.privateKeyToPem(keypair.privateKey, publicKeyPEMPasswordBytesHex);

    const CONFIGURATION = {
      privateKeyPassword: publicKeyPEMPasswordBytesHex,
      privateKey: Buffer.from(privateKeyPEM).toString('base64'),
    };

    const payload = `${Array(80 + 1).join('#')}
${Array(80 + 1).join('-')}
.env file:
${Array(80 + 1).join('-')}
# Node-RED
TIMEZONE="Europe/Zagreb"
CONFIGURATION=${JSON.stringify(JSON.stringify(CONFIGURATION))}
## Backwards hook from microservice to HASURA ENGINE
API_ENDPOINT="http://graphql-engine:8080/v1/graphql"
API_ENDPOINT_SECRET="${adminSecretBytesHex}"
## AWS creds needed for login/registration SMS/Emails
AWS_ACCESS_KEY_ID="<INSERT_YOUR_AWS_KEY_ID>"
AWS_SECRET_ACCESS_KEY="<INSERT_YOUR_AWS_ACCESS_KEY>"
AWS_REGION="<INSERT_YOUR_AWS_REGION>"

# Hasura
HASURA_GRAPHQL_DATABASE_URL="postgres://postgres:mypostgrespassword@postgres:5432/postgres"
HASURA_GRAPHQL_ADMIN_SECRET="${adminSecretBytesHex}"
HASURA_GRAPHQL_ENABLE_TELEMETRY="false"
## Base url for all actions
ACTION_BASE_URL="http://node-red:1880"
## Auth Webhook
HASURA_GRAPHQL_AUTH_HOOK="http://node-red:1880/auth"
HASURA_GRAPHQL_AUTH_HOOK_MODE="POST"

## enable the console served by server
HASURA_GRAPHQL_ENABLE_CONSOLE="true" # set to "false" to disable console
## enable debugging mode. It is recommended to disable this in production
HASURA_GRAPHQL_DEV_MODE="true"
HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
${Array(80 + 1).join('#')}
${Array(80 + 1).join('-')}
.pubkey file:
${Array(80 + 1).join('-')}
${pki.publicKeyToPem(keypair.publicKey)}
${Array(80 + 1).join('-')}
.privkey file (password: "${publicKeyPEMPasswordBytesHex}"):
${Array(80 + 1).join('-')}
${privateKeyPEM}
${Array(80 + 1).join('-')}
`;
    res.set('Content-Type', 'text/plain; charset=UTF-8');

    res.status(200).send(payload);
  })
);

export default router;
