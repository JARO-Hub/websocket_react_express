# CubitoChat - Real-time Chat Application 💬🚀

> Aplicación de chat en tiempo real con WebSockets, Google OAuth 2.0 y arquitectura hexagonal

[![Node.js](https://img.shields.io/badge/Node.js-20.11+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7+-black.svg)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

CubitoChat es una aplicación de chat en tiempo real que permite a los usuarios unirse a salas proporcionando su nombre de usuario y nombre de sala. El proyecto aprovecha tecnologías web modernas para ofrecer una experiencia de chat fluida y responsive.

## Preview

<image src="login.jpeg" alt="login preview" width="45%" /> <image src="chat.jpeg" alt="chat preview" width="45%" />

## ✨ Características

- 🔐 **Autenticación completa con Google OAuth 2.0**
- 💬 **Mensajería en tiempo real** con WebSockets (Socket.io)
- 🏛️ **Arquitectura hexagonal** en backend y frontend
- 🏠 **Chat basado en salas** dinámicas
- 📱 **Interfaz responsive** con Tailwind CSS
- 🗄️ **Persistencia** de mensajes en MongoDB
- ✍️ **Indicador de escritura** en tiempo real
- 📊 **Estadísticas de sala** en vivo
- 👥 **Sistema de usuarios** con perfiles de Google

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js v20.11+ o v22.12+
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

Crea un archivo `.env` en la carpeta `client/` con:
```env
VITE_SERVER_URL=http://localhost:4000
```

### Ejecutar la Aplicación

```bash
# Terminal 1: Iniciar Backend
cd backend
npm run dev

# Terminal 2: Iniciar Frontend
cd client
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📚 Documentación Completa

- **[Documentación Técnica](./DOCUMENTATION.md)** - Arquitectura completa, APIs, eventos de Socket.io
- **[Guía de Configuración de Google OAuth](./GOOGLE_OAUTH_SETUP.md)** - Paso a paso para configurar OAuth
- **[Guía de Uso de Google Auth](./GOOGLE_AUTH_USAGE.md)** - Cómo funciona la autenticación

## 🏗️ Tecnologías Utilizadas

### Frontend

- **Framework**: Vite (React + TypeScript)
- **Styling**: Tailwind CSS

### Backend

- **Server**: Node.js
- **Framework**: Express
- **Real-time Communication**: Socket.IO

## Environment Configuration

### Server

In the `server` folder, there is a `.env` file where you can set the following variables:

- `PORT`: The port on which the server will run (default is `3001`).

- `CORS_ORIGIN`: The origin allowed by CORS (default is `http://localhost:5173`).

### Client

In the `client` folder, there is a `.env.local` file where you can set the following variables:

- `PORT`: The port where the server is running (default is `3001`).
- `VITE_SERVER_URL`: The URL of the server if it is deployed somewhere other than the local machine (default is `http://localhost:3001`).

## Setup and Installation

### Installation steps

1. Clone the repository
    ```bash
    git clone https://github.com/JARO_Hub/websocket_react_and_express.git
    cd websocket_react_and_express
    ```

2. Install dependencies for the frontend
    ```bash
    cd client
    npm install
    ```

2. Install dependencies for the backend
    ```bash
    cd ../server
    npm install
    ```

### Running the Application

1. Start the backend server
    ```bash
    cd server
    npm start
    ```
    The server will start on `http://localhost:3001`.

2. Start the frontend development server
    ```bash
    cd ../client
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

## Usage

1. Open your browser and navigate to http://localhost:5173.
2. Enter a username and room name to join a chat room.
3. Start chatting in real-time!