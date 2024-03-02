import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config.js';
import { encryptPassword } from '../utils/encrypt.js';

export async function registerUser(user) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.username.match(usernameRegex)) {
    throw { message: 'Username can only contain letters and numbers', status: 400 };
  }
  if (!user.password.match(passwordRegex)) {
    throw { message: 'Password can only contain letters and numbers', status: 400 };
  }
  if (!user.email.match(emailRegex)) {
    throw { message: 'Email must be "test@mail.com"', status: 400 };
  }
  const requiredFields = ['username', 'password', 'email'];
  for (const field of requiredFields) {
    if (!user[field]) {
      throw { message: `Field '${field}' is required`, status: 400 };
    }
  }

  const exists = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] });
  if (exists) throw { message: 'Username or email already exists', status: 400 };

  user.password = await encryptPassword(user.password);
  const userDoc = new User(user);
  return await userDoc.save();
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas.');
  }

  const token = jwt.sign(
    { userId: user._id },
    config.app.secretKey,
    { expiresIn: '12h' }
  );

  return token;
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }
  return user;
};

const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('Usuario no encontrado.');
  }
  return deletedUser;
};

export default {
  registerUser,
  loginUser,
  updateUser,
  deleteUser
};
