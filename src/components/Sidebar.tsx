import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchChatrooms, createChatroom } from '../services/api';
import { Chatroom } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EventEmitter } from '../utils/EventEmitter';
import { toast } from 'react-toastify';

export const Sidebar: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(280);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchChatroomList = useCallback(async () => {
    try {
      const data = await fetchChatrooms();
      setChatrooms(data);
    } catch (error) {
      console.error('Failed to fetch chatrooms:', error);
    }
  }, []);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= 200 && newWidth <= 600) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

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

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

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
    <div
      className="sidebar"
      ref={sidebarRef}
      style={{ width: `${width}px` }}
    >
      <div className="sidebar-header">
        <h2>Chatrooms</h2>
        {user && <p className="user-email">{user.email}</p>}
      </div>
      <form onSubmit={handleCreateChatroom}>
        <input
          type="text"
          value={newChatroomName}
          onChange={(e) => setNewChatroomName(e.target.value)}
          placeholder="New Chatroom Name"
        />
        <button type="submit">Create Chatroom</button>
      </form>
      <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
            <Link to={`/chatrooms/${chatroom.id}`}>{chatroom.name}</Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <Link to="/" className="home-link">Home</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="sidebar-resizer" onMouseDown={startResizing}></div>
    </div>
  );
};