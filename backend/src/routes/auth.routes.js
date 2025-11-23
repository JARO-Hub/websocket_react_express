// src/routes/auth.routes.js
const router = require('express').Router();
const passport = require('passport');
const { oauthSuccess, oauthFailure } = require('../controllers/authController');

// Inicia el proceso de Login con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback definido en Google Cloud Console
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure', session: false }),
  oauthSuccess
);

router.get('/failure', oauthFailure);

module.exports = router;
