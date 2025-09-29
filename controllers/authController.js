// authController.js
const jwt = require('jsonwebtoken');

const roleMap = {
  'admin': 1,
  'bibliotecario': 2,
  'tutor': 3
};

const loginWithToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token no enviado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = {
      userId: decoded.userId,
      email: decoded.email,
      nombre: decoded.nombre || '',   // si PHP lo incluye
      apellido: decoded.apellido || '',
      rol: roleMap[decoded.rol]
    };
    return res.json({ success: true, user: user });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

module.exports = { loginWithToken };
