import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../services/ws';
import { Chatroom as ChatroomType, Message } from '../types/index';
import { MessageList } from '../components/MessageList';

export const Chatroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatroom, setChatroom] = useState<ChatroomType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'joinSuccess' && message.messages) {
      setMessages(message.messages.reverse());
    } else if (message.type === 'message' && message.message) {
      setMessages((prevMessages) => [...prevMessages, message.message]);
    }
  }, []);

  const { sendMessage } = useWebSocket(id || '', handleMessage);

  useEffect(() => {
    const fetchChatroom = async () => {
      try {
        const response = await api.get(`/chatrooms/${id}`);
        setChatroom(response.data);
        setNewName(response.data.name);
      } catch (err) {
        console.error('Failed to fetch chatroom:', err);
      }
    };

    fetchChatroom();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setNewName(chatroom?.name || '');
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      setError('Chatroom name cannot be empty.');
      return;
    }

    try {
      const response = await api.put(`/chatrooms/${id}`, { name: newName });
      setChatroom(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Failed to update chatroom:', err);
      setError('Failed to update chatroom name. Please try again.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this chatroom? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await api.delete(`/chatrooms/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete chatroom:', err);
      setError('Failed to delete chatroom. Please try again.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!chatroom) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chatroom-container">
      <Sidebar />
      <div className="chatroom-content">
        <div className="chatroom-header">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="chatroom-name-input"
              />
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
              {error && <div className="error-message">{error}</div>}
            </>
          ) : (
            <>
              <h2>{chatroom.name}</h2>
              <button onClick={handleEdit} className="edit-button">Edit</button>
              <button onClick={handleDelete} className="delete-button">Delete</button>
            </>
          )}
        </div>
        <div className="chatroom-messages">
          <MessageList messages={messages} />
        </div>
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            required
          />
          <button type="submit">Send</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};