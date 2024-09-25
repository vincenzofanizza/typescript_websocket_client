import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Signup function
export const signup = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const response = await api.post('/auth/signup', { email, password, firstName, lastName });
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Fetch chatrooms function
export const fetchChatrooms = async () => {
  try {
    const response = await api.get('/chatrooms');
    return response.data;
  } catch (error) {
    console.error('Fetch chatrooms failed:', error);
    throw error;
  }
};