import {SupportMessage} from 'screens/Profile/SupportChat/types';
import mockEmitter from 'utils/mockEmitter';

const DUMMY_CONVERSATION_ID = 'conv_mock_001';
let localMessages: SupportMessage[] = [
  {
    id: '1',
    conversation_id: DUMMY_CONVERSATION_ID,
    sender_id: 'admin_1',
    sender_type: 'admin',
    message_type: 'text',
    message: 'Hello! Welcome to Fearless Support.',
    media_url: null,
    thumbnail: null,
    duration: null,
    status: 'read',
    created_at: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '2',
    conversation_id: DUMMY_CONVERSATION_ID,
    sender_id: 'user_1',
    sender_type: 'user',
    message_type: 'text',
    message: "Hi, I'm having an issue.",
    media_url: null,
    thumbnail: null,
    duration: null,
    status: 'read',
    created_at: new Date(Date.now() - 50000).toISOString(),
  },
  {
    id: '3',
    conversation_id: DUMMY_CONVERSATION_ID,
    sender_id: 'admin_1',
    sender_type: 'admin',
    message_type: 'video',
    message: '',
    media_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://www.w3schools.com/html/pic_trulli.jpg',
    duration: 10,
    status: 'read',
    created_at: new Date(Date.now() - 40000).toISOString(),
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockApi = {
  getOrCreateConversation: async () => ({
    conversation_id: DUMMY_CONVERSATION_ID,
    status: 'active',
  }),

  getMessages: async (
    conversationId: string,
    page: number,
    limit: number = 20,
  ) => {
    await delay(500);
    const sorted = [...localMessages].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return {
      conversation_id: conversationId,
      page,
      has_next_page: false,
      messages: sorted,
    };
  },

  sendMessage: async (payload: any): Promise<SupportMessage> => {
    await delay(300);
    const newMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: DUMMY_CONVERSATION_ID,
      sender_id: 'user_1',
      sender_type: 'user',
      message_type: payload.message_type || 'text',
      message: payload.message || '',
      media_url: payload.media_url || null,
      thumbnail: payload.thumbnail || null,
      duration: payload.duration || null,
      status: 'sent',
      created_at: new Date().toISOString(),
    };
    localMessages.push(newMessage);

    // Simulate Status Ticks
    setTimeout(() => {
      newMessage.status = 'delivered';
      mockEmitter.emit('message_delivered', {
        message_id: newMessage.id,
        status: 'delivered',
      });
    }, 1000);
    setTimeout(() => {
      newMessage.status = 'read';
      mockEmitter.emit('message_read', {
        message_id: newMessage.id,
        status: 'read',
      });
    }, 2500);

    // Simulate Admin Auto-Reply
    setTimeout(() => {
      const reply: SupportMessage = {
        id: `msg_admin_${Date.now()}`,
        conversation_id: DUMMY_CONVERSATION_ID,
        sender_id: 'admin_1',
        sender_type: 'admin',
        message_type: 'text',
        message:
          "This is a dummy auto-reply. Your backend isn't connected yet!",
        media_url: null,
        thumbnail: null,
        duration: null,
        status: 'sent',
        created_at: new Date().toISOString(),
      };
      localMessages.push(reply);
      mockEmitter.emit('new_message', {
        conversation_id: DUMMY_CONVERSATION_ID,
        message: reply,
      });
    }, 4000);

    return newMessage;
  },

  uploadMedia: async (fileUri: string, type: string) => {
    await delay(1500); // Simulate upload time
    // Return dummy public URLs so the UI renders properly
    if (type === 'video')
      return {
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://www.w3schools.com/html/pic_trulli.jpg',
      };
    if (type === 'audio')
      return {
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      };
    return {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };
  },
  markAsRead: async () => {},
};

export const MockSocket = {
  connect: (value?: any) => {},
  disconnect: () => {},
  joinConversation: (value?: any) => {},
  onNewMessage: (cb: (msg: SupportMessage) => void) =>
    mockEmitter.on('new_message', data => cb(data.message)),
  onMessageDelivered: (cb: (id: string, status: string) => void) =>
    mockEmitter.on('message_delivered', data =>
      cb(data.message_id, data.status),
    ),
  onMessageRead: (cb: (id: string, status: string) => void) =>
    mockEmitter.on('message_read', data => cb(data.message_id, data.status)),
  offAllListeners: () => {
    mockEmitter.off('new_message');
    mockEmitter.off('message_delivered');
    mockEmitter.off('message_read');
  },
};
