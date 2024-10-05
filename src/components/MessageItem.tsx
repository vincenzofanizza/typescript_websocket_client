import React from 'react';
import { Message } from '../types/index';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const senderName = message.sentBy
    ? `${message.sentBy.firstName} ${message.sentBy.lastName}`
    : 'Deleted Account';
  const initials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
  const timestamp = new Date(message.createdAt).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="message-item">
      <div className="message-avatar">{initials}</div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{senderName}</span>
          <span className="message-timestamp">{timestamp}</span>
        </div>
        <div className="message-text">{message.content}</div>
      </div>
    </div>
  );
};