import React, { createContext, useState, useContext, useEffect } from 'react';

const TOKEN_STORAGE_KEY = 'authToken';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const isAuthenticated = !!token;

  const login = (jwt, userData) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, jwt);
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      // **Nota:** En un proyecto real, aquí se verificaría la validez del token.
      // Aquí, simulamos cargar los datos del usuario.
      const dummyUser = { id: 'usuario_123', username: 'Dylan' };
      setUser(dummyUser);
    }
  }, [token]);

  const contextValue = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

