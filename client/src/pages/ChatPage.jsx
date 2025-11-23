// frontend/src/pages/ChatPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../hooks/useSocket';
import { useChat } from '../hooks/useChat';
import ScrollToBottom from 'react-scroll-to-bottom';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { socket, isConnected, error } = useSocket();

  // Estados para el chat
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState(user?.name || user?.username || '');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const typingTimeoutRef = useRef(null);

  // Actualizar username cuando cambie el usuario
  useEffect(() => {
    if (user && !username) {
      setUsername(user.name || user.username || user.email);
    }
  }, [user, username]);

  // Hook del chat (solo se activa cuando hay socket y sala)
  const {
    messages,
    isLoading,
    typingUsers,
    roomStats,
    sendMessage,
    notifyTyping,
    notifyStopTyping
  } = useChat(hasJoined ? socket : null, room, username);

  // Unirse a la sala
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim() && socket) {
      setHasJoined(true);
    }
  };

  // Enviar mensaje
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
      setCurrentMessage('');
      notifyStopTyping();
    }
  };

  // Manejar tecleo
  const handleTyping = () => {
    if (!hasJoined) return;

    notifyTyping();

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Dejar de escribir después de 2 segundos
    typingTimeoutRef.current = setTimeout(() => {
      notifyStopTyping();
    }, 2000);
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Si no está conectado, mostrar pantalla de unirse
  if (!hasJoined) {
    return (
      <div className="min-h-screen h-full w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center bg-no-repeat px-8">
        <div className="flex flex-col justify-center items-center text-center space-y-6 bg-gray-500/80 backdrop-blur-sm rounded-xl py-12 px-8 min-w-[400px] max-w-md">
          <h1 className="text-3xl font-bold">🚀 Unirse al Chat</h1>

          {/* Estado de conexión */}
          <div className="text-sm">
            {isConnected ? (
              <span className="text-green-300">✅ Conectado</span>
            ) : (
              <span className="text-red-300">❌ Desconectado</span>
            )}
            {error && <p className="text-red-400 mt-2">Error: {error}</p>}
          </div>

          <form onSubmit={handleJoinRoom} className="w-full space-y-4">
            <input
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md text-black outline-none"
              required
            />
            <input
              type="text"
              placeholder="ID de la sala (ej: sala1)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-3 rounded-md text-black outline-none"
              required
            />
            <button
              type="submit"
              disabled={!isConnected}
              className="w-full px-6 py-3 text-lg font-medium bg-cyan-950 hover:bg-cyan-800 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Unirse a la Sala
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pantalla del chat
  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center text-white bg-[url(/src/assets/bg_cubitochat.png)] bg-cover bg-center bg-no-repeat p-4">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden">

        {/* Header */}
        <header className="px-6 py-4 bg-cyan-950 border-b border-cyan-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Avatar del usuario */}
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={username}
                  className="w-10 h-10 rounded-full border-2 border-cyan-400"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">💬 Sala: {room}</h2>
                <p className="text-sm text-gray-300">
                  {user?.email || `Usuario: ${username}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Estadísticas de la sala */}
              {roomStats && (
                <div className="text-right text-sm">
                  <p>👥 {roomStats.participantCount} participantes</p>
                  <p>📨 {roomStats.messageCount} mensajes</p>
                </div>
              )}

              {/* Botón de logout */}
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    logout();
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                title="Cerrar sesión"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </header>

        {/* Área de mensajes */}
        <main className="flex-1 overflow-hidden px-4 py-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">Cargando mensajes...</p>
            </div>
          ) : (
            <ScrollToBottom className="h-full overflow-y-auto">
              <div className="space-y-3 py-4">
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.socketId === socket?.id || msg.author === username;

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col p-3 rounded-lg max-w-[70%] ${
                        isOwnMessage
                          ? 'ml-auto bg-cyan-700'
                          : 'mr-auto bg-gray-700'
                      }`}
                    >
                      <p className="font-bold text-sm text-cyan-200">
                        {isOwnMessage ? 'Tú' : msg.author}
                      </p>
                      <p className="text-base mt-1">{msg.message}</p>
                      <p className="text-xs text-gray-300 text-right mt-1">
                        {msg.time || new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  );
                })}

                {/* Indicador de escritura */}
                {typingUsers.length > 0 && (
                  <div className="text-sm text-gray-400 italic px-3">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está' : 'están'} escribiendo...
                  </div>
                )}
              </div>
            </ScrollToBottom>
          )}
        </main>

        {/* Footer - Input de mensaje */}
        <footer className="px-4 py-4 bg-gray-900 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={currentMessage}
              onChange={(e) => {
                setCurrentMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 px-4 py-3 rounded-md text-white bg-gray-800 outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-medium transition-colors"
            >
              Enviar
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;