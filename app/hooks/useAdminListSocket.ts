// hooks/useAdminListSocket.ts
import {useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {getPrefsValue} from '../utils/storage';
import {STORAGE} from '@constants';

export interface AdminConversationPayload {
  conversation_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
  };
  last_message: {
    message: string;
    message_type: string;
    sender_type: string;
    created_at: string;
  } | null;
  unread_count: number;
  status: string;
}

export const useAdminListSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isUnmountedRef = useRef(false);
  useEffect(() => {
    const token = getPrefsValue(STORAGE.TOKEN);
    if (!token) {
      console.error('[AdminList WS] Error: No token found');
      return;
    }
    isUnmountedRef.current = false;
    reconnectAttemptsRef.current = 0;
    const connect = () => {
      if (isUnmountedRef.current) return;
      const wsUrl = `wss://app.fearlesscode.de/ws/support-chat/admin/conversations/?token=${token}`;
      console.log('[AdminList WS] Connecting...');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        if (isUnmountedRef.current) {
          ws.close();
          return;
        }
        console.log('[AdminList WS] Connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = event => {
        try {
          const response = JSON.parse(event.data);
          const data = response.data as AdminConversationPayload;
          console.log(`[AdminList WS] Event: ${response.event}`, data);
          if (response.event === 'conversation_created') {
            DeviceEventEmitter.emit('NEW_CONVERSATION_CREATED', data);
          } else if (response.event === 'conversation_updated') {
            DeviceEventEmitter.emit('CONVERSATION_UPDATED', data);
          } else if (response.event === 'conversation_deleted') {
            DeviceEventEmitter.emit('CONVERSATION_DELETED', data);
          }
        } catch (error) {
          console.error('[AdminList WS] Message Parse Error:', error);
        }
      };

      ws.onerror = error => {
        console.error('[AdminList WS] Connection Error');
        setIsConnected(false);
      };

      ws.onclose = event => {
        console.log('[AdminList WS] Closed. Code:', event.code);
        setIsConnected(false);
        wsRef.current = null;
        if (
          !isUnmountedRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000,
          );
          reconnectAttemptsRef.current += 1;
          console.log(`[AdminList WS] Reconnecting in ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };
    };

    connect();

    // Cleanup on unmount
    return () => {
      console.log('[AdminList WS] Cleanup');
      isUnmountedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {isConnected};
};
