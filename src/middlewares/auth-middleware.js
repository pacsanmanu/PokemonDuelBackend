import jwt from 'jsonwebtoken';
import { HttpStatusError } from 'common-errors';
import config from '../config.js';
import logger from '../utils/logger.js';

export const checkToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw HttpStatusError(401, 'No token provided');
  }

  // eslint-disable-next-line no-unused-vars
  const [_bearer, token] = authorization.split(' ');

  try {
    const tokenInfo = jwt.verify(token, config.app.secretKey);
    req.user = tokenInfo;
  } catch (err) {
    logger.error(err.message);
    throw HttpStatusError(401, 'Invalid token');
  }
  next();
};

export default checkToken;
