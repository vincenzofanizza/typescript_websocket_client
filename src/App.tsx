import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { Chatroom } from './pages/Chatroom';
import './App.css';

const PrivateRoute: React.FC<React.PropsWithChildren<{ path: string }>> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// TODO: Redirect to new room when creating one
// TODO: Refresh token
// TODO: Display joining and leaving messages
// ? How can I make the loading smoother?
// ? Stream changes in chatroom lists/current room?
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute path="/">
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatrooms/:id"
            element={
              <PrivateRoute path="/chatrooms/:id">
                <Chatroom />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;