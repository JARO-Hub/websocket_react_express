// src/middlewares/authRequired.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Leemos el header "Authorization" que debería contener: "Bearer <token>"
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token requerido' });

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
