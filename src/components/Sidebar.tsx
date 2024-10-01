import React, { useEffect, useState, useCallback } from 'react';
import { fetchChatrooms, createChatroom } from '../services/api';
import { Chatroom } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { EventEmitter } from '../utils/EventEmitter';
import { toast } from 'react-toastify';

export const Sidebar: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const fetchChatroomList = useCallback(async () => {
    try {
      const data = await fetchChatrooms();
      setChatrooms(data);
    } catch (error) {
      console.error('Failed to fetch chatrooms:', error);
    }
  }, []);

  useEffect(() => {
    fetchChatroomList();

    // Set up polling interval
    const intervalId = setInterval(fetchChatroomList, 3000); // Poll every 3 seconds

    // Listen for chatroomUpdated event
    const handleChatroomUpdate = () => {
      fetchChatroomList();
    };
    EventEmitter.on('chatroomUpdated', handleChatroomUpdate);

    // Clean up interval and event listener on component unmount
    return () => {
      clearInterval(intervalId);
      EventEmitter.off('chatroomUpdated', handleChatroomUpdate);
    };
  }, [fetchChatroomList]);

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatroomName.trim()) {
      toast.error('Chatroom name cannot be empty.');
      return;
    }

    try {
      const newChatroom = await createChatroom(newChatroomName);
      await fetchChatroomList();
      setNewChatroomName('');
      navigate(`/chatrooms/${newChatroom.id}`);
    } catch (error) {
      console.error('Failed to create chatroom:', error);
      toast.error('Failed to create chatroom. Please try again.');
    }
  };

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
      
      <div className="user-details">
        {user ? (
          <>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <p>No user information available</p>
        )}
      </div>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};