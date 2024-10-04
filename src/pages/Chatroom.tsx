import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../services/ws';
import { Chatroom as ChatroomType, Message } from '../types/index';
import { MessageList } from '../components/MessageList';
import { EventEmitter } from '../utils/EventEmitter';
import { toast } from 'react-toastify';

export const Chatroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatroom, setChatroom] = useState<ChatroomType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const intervalRef = useRef<number | null>(null);

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'joinSuccess' && message.messages) {
      setMessages(message.messages.reverse());
    } else if (message.type === 'message' && message.message) {
      setMessages((prevMessages) => [...prevMessages, message.message]);
    }
  }, []);

  const { sendMessage } = useWebSocket(id || '', handleMessage);

  const fetchChatroom = useCallback(async () => {
    if (isEditing) return; // Skip fetching if editing
    try {
      const response = await api.get(`/chatrooms/${id}`);
      setChatroom(response.data);
      if (!isEditing) {
        setNewName(response.data.name);
      }
    } catch (err) {
      console.error('Failed to fetch chatroom:', err);
      navigate('/');
    }
  }, [id, navigate, isEditing]);

  useEffect(() => {
    fetchChatroom();

    if (!isEditing) {
      intervalRef.current = window.setInterval(fetchChatroom, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchChatroom, isEditing]);

  const isOwner = user && chatroom && user.id === chatroom.owner.supabaseId;

  const handleEdit = () => {
    if (isOwner) {
      setIsEditing(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleCancel = () => {
    setNewName(chatroom?.name || '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error('Chatroom name cannot be empty.');
      return;
    }

    try {
      const response = await api.put(`/chatrooms/${id}`, { name: newName });
      setChatroom(prevChatroom => ({
        ...prevChatroom,
        ...response.data
      }));
      setIsEditing(false);

      // Emit an event to notify that a chatroom has been updated
      EventEmitter.emit('chatroomUpdated');
      // Resume polling after saving
      intervalRef.current = window.setInterval(fetchChatroom, 3000);
    } catch (err) {
      console.error('Failed to update chatroom:', err);
      toast.error('Failed to update chatroom name. Please try again.');
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
      toast.error('Failed to delete chatroom. Please try again.');
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
            </>
          ) : (
            <>
              <h2>{chatroom.name}</h2>
              {isOwner && (
                <>
                  <button onClick={handleEdit} className="edit-button">Edit</button>
                  <button onClick={handleDelete} className="delete-button">Delete</button>
                </>
              )}
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
      </div>
    </div>
  );
};