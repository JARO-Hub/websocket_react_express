// src/hooks/useSocket.js
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

/**
 * Hook personalizado para manejar conexiones de Socket.io
 * Sigue las mejores prácticas de React y arquitectura limpia
 *
 * @returns {Object} - Socket instance y estado de conexión
 */
export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Crear conexión de socket
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Eventos de conexión
    socketRef.current.on('connect', () => {
      console.log('✅ Socket conectado:', socketRef.current.id);
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Error de conexión:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    // Limpiar al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error
  };
};

export default useSocket;

