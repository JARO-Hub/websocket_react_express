# CubitoChat - Real-time Chat Application 💬🚀

> Aplicación de chat en tiempo real con WebSockets, Google OAuth 2.0

[![Node.js](https://img.shields.io/badge/Node.js-20.11+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7+-black.svg)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

CubitoChat es una aplicación de chat en tiempo real que permite a los usuarios unirse a salas. El proyecto aprovecha tecnologías web modernas para ofrecer una experiencia de chat fluida y responsive.

## ✨ Características

- 🔐 **Autenticación completa con Google OAuth 2.0**
- 💬 **Mensajería en tiempo real** con WebSockets (Socket.io)
- 🏠 **Chat basado en salas** dinámicas
- 📱 **Interfaz responsive** con Tailwind CSS
- 🗄️ **Persistencia** de mensajes en MongoDB
- ✍️ **Indicador de escritura** en tiempo real
- 👥 **Sistema de usuarios** con perfiles de Google

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js v22.12+
- npm v10+
- Cuenta de MongoDB Atlas (o MongoDB local)
- (Opcional) Credenciales de Google OAuth para autenticación

### Instalación y Configuración

1. **Instalar dependencias**
```bash
# Backend
cd backend
npm install

# Frontend  
cd client
npm install
```

2. **Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `backend/` con:
```env
PORT=4000
MONGODB_URI=tu_mongodb_uri_aqui
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
JWT_SECRET=tu_secreto_super_seguro
FRONTEND_URL=http://localhost:5173
```

Copiar las varibales de entorno del siguente documento: https://docs.google.com/document/d/1g0PicJVNoYmZhZvIpXW-AivHrktCQ5vothGb0QtDhiU/edit?usp=sharing

Crea un archivo `.env` en la carpeta `client/` con:
```env
PORT=4000
VITE_SERVER_URL=http://localhost:4000
```

### Ejecutar la Aplicación

```bash
# Terminal 1: Iniciar Backend
cd backend
npm start

# Terminal 2: Iniciar Frontend
cd client
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`


## 🏗️ Tecnologías Utilizadas

### Frontend

- **Framework**: Vite (React + TypeScript)
- **Styling**: Tailwind CSS

### Backend

- **Server**: Node.js
- **Framework**: Express
- **Real-time Communication**: Socket.IO
