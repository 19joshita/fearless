export interface ChatMessage {
  uuid: string;
  user: string;
  room: string;
  prompt: string | null;
  response: string | null;
  created_at: string; // or Date if parsed
  updated_at: string; // or Date if parsed
}
