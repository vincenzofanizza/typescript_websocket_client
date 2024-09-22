import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login function with credentials
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Signup function
export const signup = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const response = await api.post('/auth/signup', { email, password, firstName, lastName });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// ? Add logout endpoint?
export const logout = async () => {
  try {
    localStorage.removeItem('authToken'); 
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
