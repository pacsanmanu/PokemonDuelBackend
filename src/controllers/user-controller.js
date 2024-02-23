import userService from '../services/user-service.js';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../services/mongodb/mongodb-users.js';
import { checkHash } from '../utils/encrypt.js';
import config from '../config.js';
import { HttpStatusError } from 'common-errors';

export async function register(req, res) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
}

export async function login(req, res, next){
  const { email, password } = req.body;
  try {

    const user = await getUserByEmail(email);

    if(user){
      if(checkHash(password, user.password)){
        const userInfo = { id: user.id, username: user.username, email: user.email, victories: user.victories, longestWinStreak: user.longestWinStreak};
        const jwtConfig = { expiresIn: 3600 };
        const token = jwt.sign(userInfo, config.app.secretKey, jwtConfig);
        return res.send({token});
      }
    }
    throw new HttpStatusError(401, 'Invalid credentials');
  } catch(error){
    next(error)
  }
}