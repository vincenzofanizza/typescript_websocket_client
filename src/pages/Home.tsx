import React from 'react';
import { Sidebar } from '../components/Sidebar';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <h1>Welcome!</h1>
        <p>Select a chatroom from the sidebar or create a new one to get started.</p>
      </div>
    </div>
  );
};