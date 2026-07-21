// ==================== Admin Conversation List ====================
export interface ConversationUser {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
}

export interface LastMessage {
  message: string;
  message_type: 'text' | 'audio' | 'video' | 'image';
  sender_type: 'user' | 'admin';
  created_at: string;
}

export interface Conversation {
  conversation_id: number;
  user: ConversationUser;
  last_message: LastMessage;
  unread_count: number;
  status: 'active' | 'closed';
}

export interface GetAdminConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export interface GetAdminConversationsParams {
  page: number;
  limit?: number;
}

// ==================== Create/Get Conversation (User) ====================
export interface CreateConversationResponse {
  success: boolean;
  data: {
    conversation_id: string;
    status: string;
  };
}

// ==================== Messages ====================
export interface Participant {
  id: number;
  role: 'user' | 'admin';
  name: string;
  profile_image: string | null;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  sender_type: 'user' | 'admin';
  message_type: 'text' | 'image' | 'video' | 'audio';
  message: string | null;
  media_url: string | null;
  thumbnail: string | null;
  duration: number | null;
  status: MessageStatus;
  created_at: string;
  updated_at?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  has_next_page: boolean;
}

export interface GetMessagesResponse {
  success: boolean;
  data: {
    conversation: {
      id: string;
      status: string;
    };
    participants: Participant[];
    messages: Message[];
    pagination: Pagination;
  };
}

export interface GetMessagesParams {
  conversationId: string | number;
  page: number;
  limit?: number;
}

// ==================== Send Message ====================
export interface SendMessageParams {
  conversation_id: string | number;
  message_type: 'text' | 'audio' | 'video' | 'image';
  message?: string;
  media_url?: string | null;
  duration?: number | null;
  thumbnail?: string | null;
}

export interface SendMessageResponse {
  success: boolean;
  data: Message;
}

// ==================== Upload File ====================
export interface UploadFileResponse {
  url: string;
}

// ==================== Read Conversation ====================
export interface ReadConversationParams {
  conversation_id: string | number;
}

export interface ReadConversationResponse {
  status: string;
}

// ==================== Unread Count ====================
export interface UnreadCountResponse {
  count: number;
}

// ==================== Device Token ====================
export interface DeviceTokenParams {
  device_token: string;
  device_type: 'android' | 'ios';
}

export interface DeviceTokenResponse {
  status: string;
}

export interface UpdateMessageParams {
  messageId: number;
  message: string;
}

export interface DeleteMessageParams {
  messageId: number;
  conversationId: number;
}

export interface DeleteConversationParams {
  conversationId: number;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}
export interface DeleteMessageParams {
  messageId: number;
  conversationId: number;
}

export interface DeleteMessageResponse {
  // Adjust based on what your backend actually returns
  message?: string;
  success?: boolean;
}

export interface UpdateMessageParams extends SendMessageParams {
  messageId: number;
  conversationId: number;
}

export interface UpdateMessageResponse {
  data?: Message;
  message?: string;
}

export interface DeleteConversationParams {
  conversationId: number;
  messageId: string;
  is_deleted?: boolean;
}

export interface DeleteConversationResponse {
  message?: string;
  success?: boolean;
}
export interface MarkMessagesAsReadParams {
  conversationId: number | string;
  message_ids: number[];
}

export interface MarkMessagesAsReadResponse {
  success: boolean;
  message: string;
}
export interface ReadConversationByIdParams {
  conversation_id: string;
}

export interface ReadConversationByIdResponse {
  success: boolean;
  message: string;
}