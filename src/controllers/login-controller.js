import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/user.js';

export default async function login(req, res, next){
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      const isMatch = bcrypt.compareSync(password, user.password);
      console.log(password);
      console.log(user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Credenciales inválidas." });
      }
  
      const token = jwt.sign(
        { userId: user._id },
        config.app.secretKey,
        { expiresIn: '12h' }
      );
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor." });
    }
}