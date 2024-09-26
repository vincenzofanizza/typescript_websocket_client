import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch user data using the token
      api.get('/users/me').then(response => {
        setUser(response.data);
      }).catch(() => {
        setUser(null);
        localStorage.removeItem('authToken');
      });
    }
  }, []);

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
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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