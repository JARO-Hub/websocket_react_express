import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const dummyJwt = 'TOKEN_JWT_SIMULADO';
    const dummyUser = { id: 'dylan123', username: 'Dylan' };
    
    login(dummyJwt, dummyUser); 
    
    navigate('/chat');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center px-8">
      <div className="w-fit flex flex-col justify-center items-center text-center space-y-6 bg-gray-500/80 backdrop-blur-sm rounded-xl py-12 px-8 min-w-[400px]">
        <h1 className="text-4xl font-bold">Bienvenido a CubitoChat</h1>
        <p className="text-lg">Inicia sesión para comenzar a chatear</p>
        <button
          onClick={handleLogin}
          className="px-6 py-3 text-lg font-medium bg-cyan-950 hover:bg-cyan-300 rounded-md transition-colors w-full"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default LoginPage;