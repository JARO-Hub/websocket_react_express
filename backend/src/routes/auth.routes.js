// src/routes/auth.routes.js
const router = require('express').Router();
const passport = require('passport');
const { oauthSuccess, oauthFailure, logout, verifyAuth } = require('../controllers/authController');
const authRequired = require('../middlewares/authRequired');

/**
 * @route   GET /auth/google
 * @desc    Inicia el flujo de autenticación con Google OAuth
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * @route   GET /auth/google/callback
 * @desc    Callback de Google OAuth después de la autenticación
 * @access  Public (pero requiere autenticación de Google)
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false
  }),
  oauthSuccess
);

/**
 * @route   GET /auth/failure
 * @desc    Ruta de fallo de autenticación
 * @access  Public
 */
router.get('/failure', oauthFailure);

/**
 * @route   POST /auth/logout
 * @desc    Cierra la sesión del usuario
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   GET /auth/verify
 * @desc    Verifica si el token JWT es válido y retorna datos del usuario
 * @access  Private (requiere token)
 */
router.get('/verify', authRequired, verifyAuth);

/**
 * @route   GET /auth/me
 * @desc    Obtiene los datos del usuario autenticado
 * @access  Private (requiere token)
 */
router.get('/me', authRequired, (req, res) => {
  res.json({
    success: true,
    user: req.user.getPublicProfile ? req.user.getPublicProfile() : req.user
  });
});

module.exports = router;
