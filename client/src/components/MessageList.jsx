// frontend/src/components/MessageList.jsx

import React from 'react';
import MessageItem from './MessageItem';

const dummyMessages = [
  { id: 1, text: "¡Hola a todos! Este es un mensaje propio.", sender: 'UserA' },
  { id: 2, text: "Bienvenido a Cubitochat.", sender: 'System' },
  ...Array.from({ length: 15 }, (_, i) => ({ 
    id: i + 3, 
    text: `Mensaje de prueba #${i + 1} para llenar el espacio.`, 
    sender: i % 2 === 0 ? 'UserB' : 'UserA' 
  })),
  { id: 18, text: "Este es el último mensaje.", sender: 'UserA' },
];

const MessageList = () => {
  return (
    <div 
      className="message-list-container" 
      style={{ 
        overflowY: 'auto',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {dummyMessages.map((msg) => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
        />
      ))}
    </div>
  );
};

export default MessageList;