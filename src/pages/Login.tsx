import React from 'react';
import { LoginForm } from '../components/Auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="auth-container">
      <LoginForm />
    </div>
  );
};