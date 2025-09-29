const jwt = require("jsonwebtoken");

function verifyTokenFunction(token) {
  try {
    // La clave debe ser la misma que usas en PHP para generar el JWT
    const secret = process.env.JWT_SECRET;
    
    const decoded = jwt.verify(token, secret);
    // decoded contendrá los datos que PHP puso en el token
    return decoded;
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}

module.exports = { verifyTokenFunction };
