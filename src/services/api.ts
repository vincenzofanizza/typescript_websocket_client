import axios from 'axios';
import { Chatroom } from '../types/index';

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

// Authentication Functions

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { authToken } = response.data;
    localStorage.setItem('authToken', authToken);
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
    const { authToken } = response.data;
    localStorage.setItem('authToken', authToken);
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
    throw error;
  }
};

// Chatroom Management Functions

// Fetch all chatrooms
export const fetchChatrooms = async (): Promise<Chatroom[]> => {
  try {
    const response = await api.get('/chatrooms');
    return response.data;
  } catch (error) {
    console.error('Fetch chatrooms failed:', error);
    throw error;
  }
};

// Fetch a single chatroom by ID
export const fetchChatroom = async (id: string): Promise<Chatroom> => {
  try {
    const response = await api.get(`/chatrooms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch single chatroom failed:', error);
    throw error;
  }
};

// Create a new chatroom
export const createChatroom = async (name: string): Promise<Chatroom> => {
  try {
    const response = await api.post('/chatrooms', { name });
    return response.data;
  } catch (error) {
    console.error('Create chatroom failed:', error);
    throw error;
  }
};

// Update an existing chatroom
export const updateChatroom = async (id: string, name: string): Promise<Chatroom> => {
  try {
    const response = await api.put(`/chatrooms/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error('Update chatroom failed:', error);
    throw error;
  }
};

// Delete a chatroom
export const deleteChatroom = async (id: string): Promise<void> => {
  try {
    await api.delete(`/chatrooms/${id}`);
  } catch (error) {
    console.error('Delete chatroom failed:', error);
    throw error;
  }
};