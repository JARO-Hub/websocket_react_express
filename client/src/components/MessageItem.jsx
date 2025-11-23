import React from 'react';

const CURRENT_USER = 'UserA'; 

const MessageItem = ({ message }) => {
  const isOwnMessage = message.sender === CURRENT_USER;

  const messageStyles = {
    padding: '8px 12px',
    borderRadius: '18px',
    marginBottom: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word',

    alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
    backgroundColor: isOwnMessage ? '#DCF8C6' : '#E5E5EA',
    color: '#000',
  };

  return (
    <div style={messageStyles}>
      {!isOwnMessage && (
        <strong style={{ display: 'block', fontSize: '0.8em', marginBottom: '2px', color: '#65676B' }}>
          {message.sender}
        </strong>
      )}
      <div>{message.text}</div>
    </div>
  );
};

export default MessageItem;