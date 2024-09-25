import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';

export const Chatroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatroom, setChatroom] = useState<{ id: string; name: string } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');

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
        <div>
          <p>Welcome to {chatroom.name}!</p>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};