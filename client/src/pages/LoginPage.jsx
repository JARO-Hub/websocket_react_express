import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Si el usuario ya está autenticado, redirigir al chat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Verificar si hay error en la URL (del callback de OAuth)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'auth_failed') {
      setError('No se pudo completar la autenticación con Google. Por favor, intenta nuevamente.');
    }
  }, [searchParams]);

  /**
   * Iniciar sesión con Google OAuth
   * Redirige al backend que maneja el flujo OAuth
   */
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(null);
    // Redirigir a la ruta de Google OAuth del backend
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  /**
   * Inicio de sesión de prueba (para desarrollo)
   * Permite acceder sin OAuth
   */
  const handleTestLogin = () => {
    setIsLoading(true);
    setError(null);

    try {
      const dummyJwt = 'TOKEN_JWT_SIMULADO_TEST_' + Date.now();
      const dummyUser = {
        id: 'test_user_' + Date.now(),
        name: 'Usuario de Prueba',
        username: 'Usuario de Prueba',
        email: 'test@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Usuario+Prueba'
      };

      login(dummyJwt, dummyUser);
      navigate('/chat');
    } catch (err) {
      setError('Error al iniciar sesión de prueba');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center bg-no-repeat px-8">
      <div className="flex flex-col justify-center items-center text-center space-y-6 bg-gray-500/80 backdrop-blur-sm rounded-xl py-12 px-8 min-w-[400px] max-w-md">

        {/* Logo o título */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Bienvenido a CubitoChat</h1>
          <p className="text-lg">Inicia sesión para comenzar a chatear</p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="w-full p-4 bg-red-500/80 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Botón de Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full px-6 py-3 text-lg font-medium bg-white text-gray-800 hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800"></div>
              <span>Redirigiendo...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Iniciar sesión con Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center w-full">
          <div className="flex-1 border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-300">o</span>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        {/* Botón de prueba (para desarrollo) */}
        <button
          onClick={handleTestLogin}
          disabled={isLoading}
          className="w-full px-6 py-3 text-lg font-medium bg-cyan-950 hover:bg-cyan-800 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          {isLoading ? 'Cargando...' : 'Entrar como invitado'}
        </button>

        <div className="text-xs text-gray-300 mt-4 space-y-2">
          <p>🔒 Tu información está protegida</p>
          <p className="text-gray-400">
            Al iniciar sesión, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;