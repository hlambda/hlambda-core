/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import express from 'express';
import asyncHandler from 'express-async-handler';
import { Server } from 'socket.io';

import { executeWithAdminRights, getEnvValue, isEnvTrue } from 'hlambda';

// // Define constants & errors
// import constants from "./../../constants/constants.index.js";
import errors from './errors.socket-io.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pull from global scope hlambdaEventEmitter
const { hlambdaEventEmitter } = global;
// --------------------------------------------------------------------------------
// Why do we do this?
// Hlambda emitts event 'server-ready' when the server starts to listen. In that event we have reference to server instance.
// Socket.io needs that server instance reference to work. This is not necessary if you want to run another server on different port.
let io;
const attachSocketIoServer = async (server) => {
  // const server = await global.HLAMBDA_SERVER_INSTANCE;
  // const io = new Server(server, {});
  io = new Server(server, {}); // We want to use io from router.

  io.on('connection', (socket) => {
    console.log('Socket connected!');

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected!');
    });
  });
};

// Listen for event.
hlambdaEventEmitter.on('server-ready', (server) => {
  console.log(`[hlambdaEventEmitter] 'server-ready' event occurred!`.green);
  attachSocketIoServer(server);
});
// --------------------------------------------------------------------------------

// Create express router
const router = express.Router();

// Example of serving static files on route /io
router.use('/io', express.static(path.resolve(__dirname, './public')));

router.get(
  '/io/msg',
  asyncHandler((req, res) => {
    if (typeof io === 'undefined') {
      throw new Error(errors.SOCKET_SERVER_NOT_RUNNING);
    }

    io.emit('chat message', 'Server message!');

    res.json({
      done: true,
    });
  })
);

export default router;
