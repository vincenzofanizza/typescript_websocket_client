import React from 'react';
import { Sidebar } from '../components/Sidebar';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <div className="chatroom-header">
          <h2>Welcome👋</h2>
        </div>
        <p>
          Select a chatroom from the sidebar or create a new one to get started.
        </p>
      </div>
    </div>
  );
};