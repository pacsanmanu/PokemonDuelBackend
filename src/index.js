import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import config from './config.js';
import logger from './utils/logger.js';
import initSocket from './services/socketService.js';

const { port } = config;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3001',
  },
});

initSocket(io);

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
