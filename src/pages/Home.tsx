import React from 'react';
import { Sidebar } from '../components/Sidebar';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <h1>Home</h1>
      </div>
    </div>
  );
};