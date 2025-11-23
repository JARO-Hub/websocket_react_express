// src/hooks/useChat.js
import { useEffect, useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar la lógica del chat
 * Separa la lógica de negocio de la presentación (arquitectura limpia)
 *
 * @param {Object} socket - Instancia del socket
 * @param {String} room - ID de la sala actual
 * @param {String} username - Nombre del usuario
 * @returns {Object} - Estado y funciones del chat
 */
export const useChat = (socket, room, username) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [roomStats, setRoomStats] = useState(null);

  /**
   * Unirse a una sala
   */
  const joinRoom = useCallback(() => {
    if (!socket || !room) return;

    socket.emit('join_room', { room, username });
    console.log(`📥 Uniéndose a la sala: ${room}`);
  }, [socket, room, username]);

  /**
   * Enviar un mensaje
   */
  const sendMessage = useCallback((messageText) => {
    if (!socket || !room || !messageText.trim()) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const messageData = {
      room,
      author: username,
      message: messageText.trim(),
      time: timeString,
      id: socket.id
    };

    socket.emit('send_message', messageData);
  }, [socket, room, username]);

  /**
   * Salir de una sala
   */
  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;

    socket.emit('leave_room', { room, username });
    console.log(` Saliendo de la sala: ${room}`);
  }, [socket, room, username]);

  /**
   * Notificar que el usuario está escribiendo
   */
  const notifyTyping = useCallback(() => {
    if (!socket || !room) return;
    socket.emit('typing', { room, username });
  }, [socket, room, username]);

  /**
   * Notificar que el usuario dejó de escribir
   */
  const notifyStopTyping = useCallback(() => {
    if (!socket || !room) return;
    socket.emit('stop_typing', { room, username });
  }, [socket, room, username]);

  // Efectos para escuchar eventos del socket
  useEffect(() => {
    if (!socket) return;

    // Recibir historial de la sala
    socket.on('room_history', (history) => {
      console.log(` Historial recibido: ${history.length} mensajes`);
      setMessages(history);
      setIsLoading(false);
    });

    // Recibir nuevo mensaje
    socket.on('receive_message', (data) => {
      console.log(' Nuevo mensaje recibido:', data);
      setMessages((prev) => [...prev, data]);
    });

    // Usuario se unió
    socket.on('user_joined', (data) => {
      console.log(' Usuario se unió:', data.username);
      // Opcional: Mostrar notificación
    });

    // Usuario salió
    socket.on('user_left', (data) => {
      console.log(' Usuario salió:', data.username);
      // Opcional: Mostrar notificación
    });

    // Usuario escribiendo
    socket.on('user_typing', (data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    // Usuario dejó de escribir
    socket.on('user_stop_typing', (data) => {
      setTypingUsers((prev) => prev.filter(u => u !== data.username));
    });

    // Estadísticas de la sala
    socket.on('room_stats', (stats) => {
      console.log('📊 Estadísticas de la sala:', stats);
      setRoomStats(stats);
    });

    // Error
    socket.on('error', (error) => {
      console.error(' Error del servidor:', error.message);
    });

    // Limpiar listeners al desmontar
    return () => {
      socket.off('room_history');
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('room_stats');
      socket.off('error');
    };
  }, [socket]);

  // Unirse a la sala cuando el hook se monta
  useEffect(() => {
    if (socket && room) {
      joinRoom();
    }

    // Salir de la sala al desmontar
    return () => {
      if (socket && room) {
        leaveRoom();
      }
    };
  }, [socket, room, joinRoom, leaveRoom]);

  return {
    messages,
    isLoading,
    typingUsers,
    roomStats,
    sendMessage,
    notifyTyping,
    notifyStopTyping,
    leaveRoom
  };
};

export default useChat;

