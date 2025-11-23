

//import App from './App.tsx'

// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importar el Router y el AuthProvider
// @ts-ignore
import AppRouter from './router/AppRouter';
// @ts-ignore
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Mantenemos la importación de CSS si existe

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* 2. Envolver toda la aplicación con el AuthProvider (HU5-T4) */}
        <AuthProvider>
            {/* 3. Renderizar el enrutador principal */}
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>,
)
