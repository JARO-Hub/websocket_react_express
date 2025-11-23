// src/pages/OAuthSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Página para manejar el callback exitoso de OAuth
 * Extrae el token de la URL y lo guarda en el contexto
 */
const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setError('No se recibió el token de autenticación');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        // Decodificar el payload del JWT (parte del medio)
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));

          // Extraer datos del usuario del payload
          const userData = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            avatar: payload.avatar,
            username: payload.name // Usar name como username
          };

          console.log('✅ Token recibido exitosamente');
          console.log('👤 Usuario:', userData.name);

          // Guardar en el contexto
          login(token, userData);

          // Redirigir al chat después de un breve delay
          setTimeout(() => {
            navigate('/chat', { replace: true });
          }, 500);

        } catch (decodeError) {
          console.error('Error decodificando token:', decodeError);
          setError('El token recibido no es válido');
          setTimeout(() => navigate('/login?error=invalid_token', { replace: true }), 2000);
        }
      } catch (err) {
        console.error('Error procesando OAuth callback:', err);
        setError('Error procesando la autenticación');
        setTimeout(() => navigate('/login?error=processing_error', { replace: true }), 2000);
      }
    };

    processOAuthCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center space-y-4 bg-gray-800/80 backdrop-blur-sm rounded-xl py-12 px-8">
        {error ? (
          <>
            <div className="text-red-500 text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-red-400">Error</h2>
            <p className="text-gray-300">{error}</p>
            <p className="text-sm text-gray-400">Redirigiendo al login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
            <h2 className="text-2xl font-bold">Autenticando...</h2>
            <p className="text-gray-300">Por favor espera un momento</p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="animate-pulse">🔐</div>
              <span>Verificando credenciales</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccessPage;

