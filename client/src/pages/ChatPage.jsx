// frontend/src/pages/ChatPage.jsx

import React from 'react';
import MessageList from '../components/MessageList';

const ChatPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '800px', margin: '0 auto', border: '1px solid #ccc' }}>
      
      <header style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
        <h2>Nombre del Chat / Usuario</h2>
      </header>
      
      <main 
        style={{ 
          flexGrow: 1, 
          padding: '10px', 
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column' 
        }}
      >
        <MessageList />
      </main>
      
      <footer style={{ padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
        <p>Área para la Entrada de Mensaje</p>
      </footer>
      
    </div>
  );
};

export default ChatPage;