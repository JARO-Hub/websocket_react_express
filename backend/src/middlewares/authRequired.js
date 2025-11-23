// src/middlewares/authRequired.js
const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica el JWT y carga los datos del usuario
 */
const authRequired = async (req, res, next) => {
  try {
    // Intentar obtener el token de diferentes fuentes
    let token = null;

    // 1. Desde el header Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Desde las cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3. Desde query params (menos seguro, solo para desarrollo)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    // Si no hay token, rechazar
    if (!token) {
      return res.status(401).json({
        error: 'Token requerido',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token);

    // Opcional: Cargar el usuario completo de la base de datos
    // Esto asegura que el usuario aún existe y está activo
    if (decoded.id) {
      const user = await User.findById(decoded.id).select('-__v');

      if (!user) {
        return res.status(401).json({
          error: 'Usuario no encontrado',
          message: 'El usuario asociado a este token no existe'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          error: 'Usuario inactivo',
          message: 'Tu cuenta ha sido desactivada'
        });
      }

      // Agregar el usuario completo a la request
      req.user = user;
    } else {
      // Si no hay ID, usar solo el payload del token
      req.user = decoded;
    }

    // Agregar el token decodificado también
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    console.error('❌ Error en authRequired:', error.message);

    // Manejar diferentes tipos de errores
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      });
    }

    if (error.message === 'Token inválido') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido.'
      });
    }

    return res.status(401).json({
      error: 'Error de autenticación',
      message: 'No se pudo verificar tu autenticación.'
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Similar a authRequired pero no rechaza si no hay token
 * Útil para rutas que funcionan con o sin autenticación
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.id) {
      const user = await User.findById(decoded.id).select('-__v');
      if (user && user.isActive) {
        req.user = user;
        req.tokenPayload = decoded;
      }
    }

    next();
  } catch (error) {
    // En modo opcional, si hay error simplemente continuamos sin usuario
    console.log('⚠️ Token inválido en optionalAuth, continuando sin autenticación');
    next();
  }
};

module.exports = authRequired;
module.exports.optionalAuth = optionalAuth;

