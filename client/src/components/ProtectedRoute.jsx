import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Componente de ruta protegida
 * Redirige al login si el usuario no está autenticado
 * Muestra loading mientras verifica la autenticación
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar pantalla de carga mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen h-full w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center space-y-4 bg-gray-800/80 backdrop-blur-sm rounded-xl py-12 px-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
          <h2 className="text-2xl font-bold">Verificando autenticación...</h2>
          <p className="text-gray-300">Por favor espera</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar las rutas hijas si está autenticado
  return <Outlet />;
};

export default ProtectedRoute;