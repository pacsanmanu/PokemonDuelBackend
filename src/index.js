import app from './app.js';
import config from './config.js';
import logger from './utils/logger.js';

const { port } = config;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
