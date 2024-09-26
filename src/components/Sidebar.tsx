import React, { useEffect, useState } from 'react';
import { fetchChatrooms, createChatroom } from '../services/api';
import { Chatroom } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [error, setError] = useState<string>('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatroomList();
  }, []);

  const fetchChatroomList = async () => {
    try {
      const data = await fetchChatrooms();
      setChatrooms(data);
    } catch (error) {
      console.error('Failed to fetch chatrooms:', error);
      setError('Failed to fetch chatrooms. Please try again.');
    }
  };

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatroomName.trim()) return;

    try {
      const newChatroom = await createChatroom(newChatroomName);
      setChatrooms([...chatrooms, newChatroom]);
      setNewChatroomName('');
      navigate(`/chatrooms/${newChatroom.id}`);
    } catch (error) {
      console.error('Failed to create chatroom:', error);
      setError('Failed to create chatroom. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    }
  };

  return (
    <div className="sidebar">
      <h2>Chatrooms</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCreateChatroom}>
        <input
          type="text"
          value={newChatroomName}
          onChange={(e) => setNewChatroomName(e.target.value)}
          placeholder="New Chatroom Name"
        />
        <button type="submit">Create</button>
      </form>
      <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
            <Link to={`/chatrooms/${chatroom.id}`}>{chatroom.name}</Link>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};