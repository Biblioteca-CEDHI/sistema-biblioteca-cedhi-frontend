const { verifyTokenFunction } = require("../utils/tokenUtils"); // función que valida JWT de PHP

module.exports = function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"] || req.body.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = verifyTokenFunction(token); // valida JWT de PHP
    req.user = user; // pasa info del usuario a la request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
};
