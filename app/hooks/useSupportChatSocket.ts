// hooks/useSupportChatSocket.ts
import {useEffect, useRef, useState} from 'react';
import {getPrefsValue} from '../utils/storage';
import {STORAGE} from '@constants';

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  sender_type: 'user' | 'admin';
  message_type: 'text' | 'image' | 'file';
  message: string;
  media_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

// ✅ Interface for presence data
export interface PresenceData {
  user_id: number;
  status: 'online' | 'offline';
}

export const useSupportChatSocket = (
  conversationId: string | number | null,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // ✅ CHANGED: Use a Record to track multiple users instead of a single object
  const [presenceMap, setPresenceMap] = useState<Record<number, 'online' | 'offline'>>({});
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    if (!conversationId) return;
    const token = getPrefsValue(STORAGE.TOKEN);
    if (!token) {
      console.error('WebSocket Error: No token found');
      return;
    }
    messagesRef.current = [];
    setMessages([]);
    // ✅ CHANGED: Reset the map instead of null
    setPresenceMap({});

    const wsUrl = `wss://app.fearlesscode.de/ws/support-chat/${conversationId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = event => {
      try {
        const response = JSON.parse(event.data);

        if (response.event === 'new_message') {
          const newMessage = response.data as ChatMessage;
          console.log('💬 New WS Message:', newMessage.message);

          const exists = messagesRef.current.some(m => m.id === newMessage.id);
          if (!exists) {
            messagesRef.current = [...messagesRef.current, newMessage];
            setMessages([...messagesRef.current]);
          }
          
        // ✅ NEW: Handle the initial list of online users sent right after connection
        } else if (response.event === 'presence_init' || response.type === 'presence_init') {
          console.log('🟢 Presence Init:', response.online_users || response.data?.online_users);
          
          // Safely grab the array whether the backend puts it in "data" or at the root
          const onlineUsers = response.online_users || response.data?.online_users || [];
          
          setPresenceMap(prev => {
            const newMap = {...prev};
            onlineUsers.forEach((user: PresenceData) => {
              newMap[user.user_id] = user.status;
            });
            return newMap;
          });

        } else if (response.event === 'presence') {
          const presence = response.data as PresenceData;
          console.log('🟢 Presence Update:', presence);
          
          // ✅ CHANGED: Merge into the map instead of overwriting
          setPresenceMap(prev => ({
            ...prev,
            [presence.user_id]: presence.status,
          }));
        }
      } catch (error) {}
    };

    ws.onerror = error => {
      setIsConnected(false);
    };

    ws.onclose = event => {
      setIsConnected(false);
      // ✅ CHANGED: Removed the manual offline setter here. 
      // The backend broadcasts the 'offline' event to the room automatically.
      wsRef.current = null;
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [conversationId]);

  const sendMessage = (messageText: string, messageType: string = 'text') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        message: messageText,
        message_type: messageType,
      };
      wsRef.current.send(JSON.stringify(payload));
    } else {
      console.warn('⚠️ WebSocket not connected');
    }
  };

  // ✅ CHANGED: Return presenceMap instead of presenceStatus
  return {messages, isConnected, presenceMap, sendMessage};
};