import http from 'http';
import app from './app.js';
import config from './config.js';
import logger from './utils/logger.js';
import socketLoader from './loaders/socketio-loader.js';

const { port } = config;

const server = http.createServer(app);

socketLoader(server);

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
