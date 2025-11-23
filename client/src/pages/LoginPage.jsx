import React from 'react';
import { useAuth } from '../context/AuthContext';
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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Página de Inicio de Sesión</h1>
      <button 
        onClick={handleLogin}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3f51b5', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Iniciar Sesión (Click para simular)
      </button>
    </div>
  );
};

export default LoginPage;