import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
    const { user, session } = await apiLogin(email, password);
    setUser(user);
    localStorage.setItem('authToken', session.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    await apiSignup(email, password, firstName, lastName);
    await login(email, password);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
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