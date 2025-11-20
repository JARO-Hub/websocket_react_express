// src/controllers/authController.js
const { signToken } = require('../config/jwt');

const oauthSuccess = (req, res) => {
  // Passport deja el user en req.user
  const user = req.user;
  if (!user) return res.status(400).json({ error: 'No user' });

  // Payload mínimo
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const token = signToken(payload);

  // Si quieres devolver JSON:
  if (req.query.returnJson === '1') {
    return res.json({ token, user: payload });
  }

  // Por defecto redirigimos al frontend con token en query (puedes ajustar)
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectTo = `${FRONTEND_URL}/oauth-success?token=${token}`;
  return res.redirect(redirectTo);
};

const oauthFailure = (req, res) => {
  return res.status(401).json({ error: 'Autenticación con Google fallida' });
};

module.exports = { oauthSuccess, oauthFailure };
