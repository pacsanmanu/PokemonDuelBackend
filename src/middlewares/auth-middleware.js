import jwt from 'jsonwebtoken';
import config from '../config.js';
import { HttpStatusError } from 'common-errors';
import logger from '../utils/logger.js';

export const checkToken = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        throw HttpStatusError(401, 'No token provided');
    }

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