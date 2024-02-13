import User from '../models/user.js';
import bcrypt from 'bcrypt';

export default async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está en uso.' });
    }

    await new User({ email, password }).save();

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario.' });
    console.error('Error al registrar el usuario:', error);
  }
};