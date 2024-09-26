import React from 'react';
import { Message } from '../types/index';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="message-item">
      <strong>{message.sentBy.firstName} {message.sentBy.lastName}:</strong> {message.content}
    </div>
  );
};