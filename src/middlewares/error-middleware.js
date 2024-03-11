import logger from '../utils/logger.js';

export default function errorMiddleware(err, req, res) {
  logger.error(`${err.message} ${err.stack}`);
  const { status = 500, message } = err;
  const msg = status === 500 ? 'Server Error' : message;
  const errorResponse = {
    status, message: msg,
  };
  res.status(status).send(errorResponse);
}
