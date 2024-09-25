import React from 'react';
import { SignupForm } from '../components/Auth/SignupForm';

export const Signup: React.FC = () => {
  return (
    <div className="auth-container">
      <SignupForm />
    </div>
  );
};