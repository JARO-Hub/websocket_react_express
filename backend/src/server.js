// src/server.js
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const messageService = require('./services/messageService');

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

/**
 * Manejador de conexiones de Socket.io
 * Implementa la lógica de negocio para el chat en tiempo real
 */
io.on('connection', (socket) => {
  console.log(`✅ Usuario conectado: ${socket.id}`);

  /**
   * Evento: join_room
   * Permite a un usuario unirse a una sala específica
   */
  socket.on('join_room', async (data) => {
    const { room, username } = data;

    if (!room) {
      socket.emit('error', { message: 'Sala no especificada' });
      return;
    }

    try {
      // Unir al usuario a la sala
      socket.join(room);
      console.log(`👤 ${username || socket.id} se unió a la sala: ${room}`);

      // Cargar historial de mensajes de la sala
      const messages = await messageService.getMessagesByRoom(room, 50);

      // Enviar historial al usuario que se acaba de unir
      socket.emit('room_history', messages.reverse());

      // Notificar a todos en la sala que un nuevo usuario se unió
      socket.to(room).emit('user_joined', {
        username: username || 'Anónimo',
        timestamp: new Date().toISOString()
      });

      // Obtener estadísticas de la sala
      const stats = await messageService.getRoomStats(room);
      io.to(room).emit('room_stats', stats);

    } catch (error) {
      console.error('Error al unirse a la sala:', error);
      socket.emit('error', { message: 'Error al unirse a la sala' });
    }
  });

  /**
   * Evento: send_message
   * Procesa y distribuye mensajes en una sala
   */
  socket.on('send_message', async (data) => {
    const { room, author, message, time } = data;

    if (!room || !message) {
      socket.emit('error', { message: 'Datos incompletos' });
      return;
    }

    try {
      // Guardar mensaje en la base de datos
      const savedMessage = await messageService.saveMessage({
        room,
        author: author || 'Anónimo',
        message,
        socketId: socket.id
      });

      // Preparar datos del mensaje para enviar
      const messageData = {
        id: savedMessage._id,
        room,
        author: author || 'Anónimo',
        message,
        time: time || new Date().toISOString(),
        socketId: socket.id,
        createdAt: savedMessage.createdAt
      };

      // Enviar mensaje a todos en la sala (incluyendo al emisor)
      io.to(room).emit('receive_message', messageData);

      console.log(`📨 Mensaje en ${room} de ${author}: ${message.substring(0, 30)}...`);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('error', { message: 'Error al enviar el mensaje' });
    }
  });

  /**
   * Evento: typing
   * Notifica cuando un usuario está escribiendo
   */
  socket.on('typing', (data) => {
    const { room, username } = data;
    socket.to(room).emit('user_typing', { username });
  });

  /**
   * Evento: stop_typing
   * Notifica cuando un usuario deja de escribir
   */
  socket.on('stop_typing', (data) => {
    const { room, username } = data;
    socket.to(room).emit('user_stop_typing', { username });
  });

  /**
   * Evento: leave_room
   * Permite a un usuario salir de una sala
   */
  socket.on('leave_room', (data) => {
    const { room, username } = data;
    socket.leave(room);

    socket.to(room).emit('user_left', {
      username: username || 'Anónimo',
      timestamp: new Date().toISOString()
    });

    console.log(`👋 ${username || socket.id} salió de la sala: ${room}`);
  });

  /**
   * Evento: disconnect
   * Se ejecuta cuando un usuario se desconecta
   */
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 SERVIDOR CUBITOCHAT INICIADO    ║
  ╠════════════════════════════════════════╣
  ║   Puerto: ${PORT.toString().padEnd(28)} ║
  ║   Entorno: ${process.env.NODE_ENV || 'development'}              ║
  ║   Frontend: ${FRONTEND_URL.padEnd(24)} ║
  ╚════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
});

module.exports = { server, io };

