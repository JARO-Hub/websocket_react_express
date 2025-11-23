import React, { createContext, useState, useContext, useEffect } from 'react';

const TOKEN_STORAGE_KEY = 'authToken';
const USER_STORAGE_KEY = 'authUser';
const BACKEND_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const AuthContext = createContext();

/**
 * Provider de autenticación
 * Maneja el estado de autenticación global de la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  /**
   * Función para iniciar sesión
   * @param {String} jwt - Token JWT
   * @param {Object} userData - Datos del usuario
   */
  const login = (jwt, userData) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, jwt);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    setError(null);
    console.log('✅ Usuario autenticado:', userData.name || userData.username);
  };

  /**
   * Función para cerrar sesión
   */
  const logout = async () => {
    try {
      // Opcional: Llamar al backend para invalidar el token
      if (token) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.log('Error al notificar logout:', err));
      }
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      // Limpiar almacenamiento local
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setError(null);
      console.log('👋 Sesión cerrada');
    }
  };

  /**
   * Verificar el token con el backend al cargar la aplicación
   */
  const verifyToken = async (jwt) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setError(null);
        return true;
      } else {
        // Token inválido o expirado
        logout();
        return false;
      }
    } catch (err) {
      console.error('Error verificando token:', err);
      setError('No se pudo verificar la autenticación');
      logout();
      return false;
    }
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  /**
   * Efecto para cargar y verificar el token al iniciar
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken) {
        // Intentar verificar el token con el backend
        const isValid = await verifyToken(storedToken);

        // Si la verificación falla pero hay usuario guardado, usar esos datos temporalmente
        if (!isValid && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {
            console.error('Error parseando usuario guardado:', err);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const contextValue = {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    verifyToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};


