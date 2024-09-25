import React, { useEffect, useState } from 'react';
import { fetchChatrooms } from '../services/api';
import { Chatroom } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getChatrooms = async () => {
      try {
        const data = await fetchChatrooms();
        setChatrooms(data);
      } catch (error) {
        console.error('Failed to fetch chatrooms:', error);
      }
    };

    getChatrooms();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Chatrooms</h2>
      <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
            <a href={`/chatrooms/${chatroom.id}`}>{chatroom.name}</a>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};