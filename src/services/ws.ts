import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef } from 'react';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';

interface WebSocketMessage {
  type: string;
  content?: string;
  userId?: string;
  chatRoomId?: string;
  message?: any;
  messages?: any[];
}

type Callback = (message: WebSocketMessage) => void;

export const useWebSocket = (chatRoomId: string, onMessage: Callback) => {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Initialize WebSocket connection
    ws.current = new WebSocket(WS_URL, token);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      // Send join message
      const joinMessage = {
        type: 'join',
        userId: user.id,
        chatRoomId: chatRoomId,
      };
      ws.current?.send(JSON.stringify(joinMessage));
    };

    ws.current.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      onMessage(message);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      ws.current?.close();
    };
  }, [chatRoomId, user, onMessage]);

  const sendMessage = (content: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        content,
      };
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};