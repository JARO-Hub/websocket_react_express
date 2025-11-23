// src/controllers/authController.js
const { signToken } = require('../config/jwt');

/**
 * Controlador para el éxito de la autenticación OAuth
 * Se ejecuta después de que Google OAuth verifica al usuario
 */
const oauthSuccess = async (req, res) => {
  try {
    // Passport deja el user en req.user después de la autenticación exitosa
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        error: 'No se pudo obtener la información del usuario'
      });
    }

    // Actualizar el último login
    await user.updateLastLogin();

    // Crear payload del JWT con información mínima necesaria
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };

    // Generar token JWT
    const token = signToken(payload);

    // Log para debugging
    console.log(`✅ Usuario autenticado exitosamente: ${user.email}`);

    // Opción 1: Retornar JSON (útil para APIs)
    if (req.query.returnJson === '1') {
      return res.json({
        success: true,
        token,
        user: user.getPublicProfile()
      });
    }

    // Opción 2: Redirigir al frontend con el token (flujo OAuth estándar)
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectTo = `${FRONTEND_URL}/oauth-success?token=${token}`;

    return res.redirect(redirectTo);
  } catch (error) {
    console.error('❌ Error en oauthSuccess:', error);

    // Redirigir al login con mensaje de error
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
};

/**
 * Controlador para fallo en la autenticación OAuth
 */
const oauthFailure = (req, res) => {
  console.error('❌ Autenticación con Google fallida');

  return res.status(401).json({
    error: 'Autenticación con Google fallida',
    message: 'No se pudo completar la autenticación. Por favor, intenta nuevamente.'
  });
};

/**
 * Controlador para logout
 * Invalida la sesión del usuario
 */
const logout = (req, res) => {
  try {
    // Si usas sesiones de Passport
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          console.error('Error al hacer logout:', err);
        }
      });
    }

    return res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en logout:', error);
    return res.status(500).json({
      error: 'Error al cerrar sesión'
    });
  }
};

/**
 * Controlador para verificar el token JWT
 * Útil para validar si el usuario sigue autenticado
 */
const verifyAuth = async (req, res) => {
  try {
    // El middleware authRequired ya verificó el token y agregó req.user
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: 'No autenticado'
      });
    }

    return res.json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('❌ Error en verifyAuth:', error);
    return res.status(500).json({
      error: 'Error al verificar autenticación'
    });
  }
};

module.exports = {
  oauthSuccess,
  oauthFailure,
  logout,
  verifyAuth
};
