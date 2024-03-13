import { Server } from 'socket.io';
import logger from '../utils/logger.js';
import setupCombatEvents from '../services/socketService.js';

function socketLoader(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    logger.info('Un usuario se ha conectado.');
    setupCombatEvents(io, socket);
  });
}

export default socketLoader;
