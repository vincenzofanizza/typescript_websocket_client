import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token && !user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          
          // Check if a new session was returned (token was refreshed)
          if (response.data.session) {
            const newToken = response.data.session.access_token;
            localStorage.setItem('authToken', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          toast.error('Session expired. Please log in again.');
          setUser(null);
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
        }
      } else if (!token) {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    initializeAuth();
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { user, session } = await apiLogin(email, password);
      setUser(user);
      localStorage.setItem('authToken', session.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await apiSignup(email, password, firstName, lastName);
      toast.success('Account created successfully!');
      await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please check your details and try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};