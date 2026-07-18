export type SenderType = 'user' | 'admin';
export type MessageType = 'text' | 'audio' | 'video' | 'file';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface SupportMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: SenderType;
  message_type: MessageType;
  message: string;
  media_url: string | null;
  thumbnail: string | null;
  duration: number | null;
  status: MessageStatus;
  created_at: string;
}

// Payload structure coming from the UI when sending media/files
export type MessagePayload = {
  message_type: MessageType;
  message?: string;
  media_url?: string;
  thumbnail?: string;
  duration?: number;
};