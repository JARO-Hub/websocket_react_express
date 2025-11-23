// src/models/Message.js
const mongoose = require('mongoose');

/**
 * Schema para los mensajes del chat
 * Sigue el patrón de arquitectura hexagonal manteniendo el dominio separado
 */
const MessageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      index: true // Índice para búsquedas rápidas por sala
    },
    author: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Opcional para usuarios no autenticados
    },
    socketId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Crea automáticamente createdAt y updatedAt
  }
);

// Índice compuesto para consultas eficientes
MessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);

