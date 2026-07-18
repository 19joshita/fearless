import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MessagePayload, SupportMessage } from 'screens/Profile/SupportChat/types';
import { MockApi, MockSocket } from 'services/mockservice';

// import supportSocket as MockSocket from './socket';

interface SupportChatContextType {
  messages: SupportMessage[];
  isLoading: boolean;
  sendMessage: (payload: string | MessagePayload) => Promise<void>;
  initializeChat: () => Promise<void>;
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export const SupportChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    try {
      const { conversation_id } = await MockApi.getOrCreateConversation();
      const res = await MockApi.getMessages(conversation_id, 1);
      setMessages(res.messages.reverse());
      MockSocket.connect("user_1");
      MockSocket.joinConversation(conversation_id);
    } finally { setIsLoading(false); }
  }, []);

  const sendMessage = useCallback(async (payload: string | MessagePayload) => {
    const isText = typeof payload === 'string';
    const tempId = `temp_${Date.now()}`;
    
    const optimisticMsg: SupportMessage = {
      id: tempId, conversation_id: "conv_mock_001", sender_id: "user_1", sender_type: 'user',
      message_type: isText ? 'text' : payload.message_type,
      message: isText ? payload : (payload.message || ""),
      media_url: isText ? null : (payload.media_url || null),
      thumbnail: isText ? null : (payload.thumbnail || null),
      duration: isText ? null : (payload.duration || null),
      status: 'sent', created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const body = isText ? { conversation_id: "conv_mock_001", message_type: 'text', message: payload } : { conversation_id: "conv_mock_001", ...payload };
      const savedMsg = await MockApi.sendMessage(body);
      setMessages(prev => prev.map(m => m.id === tempId ? savedMsg : m));
    } catch { setMessages(prev => prev.filter(m => m.id !== tempId)); }
  }, []);

  useEffect(() => {
    MockSocket.onNewMessage((msg) => setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]));
    MockSocket.onMessageDelivered((msgId, status) => setMessages((prev:any) => prev.map((m:any) => m.id === msgId ? { ...m, status } : m)));
    MockSocket.onMessageRead((msgId, status) => setMessages((prev:any) => prev.map((m:any) => m.id === msgId ? { ...m, status } : m)));
    return () => { MockSocket.offAllListeners(); MockSocket.disconnect(); };
  }, []);

  return (
    <SupportChatContext.Provider value={{ messages, isLoading, sendMessage, initializeChat }}>
      {children}
    </SupportChatContext.Provider>
  );
};
export const useSupportChat = () => useContext(SupportChatContext)!;