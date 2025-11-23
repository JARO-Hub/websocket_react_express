import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ChatPage from '../pages/ChatPage'; 
import OAuthSuccessPage from '../pages/OAuthSuccessPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Ruta Pública de Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta de callback OAuth */}
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />

        {/* Rutas Protegidas (Usan el componente de protección) */}
        <Route element={<ProtectedRoute />}>
          
          {/* La ruta de Chat es la principal */}
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Redirigir la ruta raíz */}
          <Route path="/" element={<Navigate to="/chat" replace />} /> 
        </Route>
        
        {/* Manejo de rutas no encontradas */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;