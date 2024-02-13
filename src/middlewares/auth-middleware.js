import jwt from "jsonwebtoken";
import config from "../config.js";

export function checkToken(req, res, next){
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ message: "Se requiere token para autenticación." });
    }
  
    try {
      const decoded = jwt.verify(token, config.app.secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido o expirado." });
    }
}