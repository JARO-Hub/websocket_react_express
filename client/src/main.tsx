<<<<<<< Updated upstream
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
=======
// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importar el Router y el AuthProvider
import AppRouter from './router/AppRouter'; 
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'; // Mantenemos la importación de CSS si existe
>>>>>>> Stashed changes

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
