// src/services/messageService.js

const Message = require('../models/Message');

/**
 * Servicio de mensajes - Capa de dominio
 * Este servicio maneja toda la lógica de negocio relacionada con mensajes
 */
class MessageService {
  /**
   * Guarda un nuevo mensaje en la base de datos
   * @param {Object} messageData - Datos del mensaje
   * @returns {Promise<Object>} Mensaje guardado
   */
  async saveMessage(messageData) {
    try {
      const message = new Message(messageData);
      return await message.save();
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('No se pudo guardar el mensaje');
    }
  }

  /**
   * Obtiene todos los mensajes de una sala específica
   * @param {String} room - Identificador de la sala
   * @param {Number} limit - Límite de mensajes (default: 50)
   * @returns {Promise<Array>} Lista de mensajes
   */
  async getMessagesByRoom(room, limit = 50) {
    try {
      return await Message.find({ room })
        .sort({ createdAt: -1 }) // Más recientes primero
        .limit(limit)
        .lean(); // Retorna objetos JS planos (más rápido)
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('No se pudieron obtener los mensajes');
    }
  }

  /**
   * Elimina mensajes antiguos de una sala (limpieza)
   * @param {String} room - Identificador de la sala
   * @param {Number} days - Días de antigüedad
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteOldMessages(room, days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return await Message.deleteMany({
        room,
        createdAt: { $lt: cutoffDate }
      });
    } catch (error) {
      console.error('Error deleting old messages:', error);
      throw new Error('No se pudieron eliminar los mensajes antiguos');
    }
  }

  /**
   * Obtiene estadísticas de una sala
   * @param {String} room - Identificador de la sala
   * @returns {Promise<Object>} Estadísticas de la sala
   */
  async getRoomStats(room) {
    try {
      const messageCount = await Message.countDocuments({ room });
      const uniqueAuthors = await Message.distinct('author', { room });

      return {
        messageCount,
        participantCount: uniqueAuthors.length,
        participants: uniqueAuthors
      };
    } catch (error) {
      console.error('Error getting room stats:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }
}

module.exports = new MessageService();

