import React from 'react';
import { Message } from '../types/index';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const senderName = message.sentBy
    ? `${message.sentBy.firstName} ${message.sentBy.lastName}`
    : 'Deleted Account';

  return (
    <div className="message-item">
      <strong>{senderName}:</strong> {message.content}
    </div>
  );
};