interface ChatMessage {
  uuid: string;
  name: string;
  user: string;
  is_saved: boolean;
  expire_time: string;
  created_at: string; // or Date if you parse it
  updated_at: string;
}

// Success response
interface CreateRoomSucessResponse {
  success: true;
  data: ChatMessage;
}

// Error response
interface CreateRoomErrorResponse {
  success: false;
  error: string;
}

// Union type for response
type CreateRoomResponse = CreateRoomSucessResponse | CreateRoomErrorResponse;

interface Params {
  prompt: string;
}
interface SendMessageParams {
  roomId: string;
  params: Params;
  isAgent: boolean;
  role?: 'mental_wellness' | 'life_optimizer';
}

interface SendMessageSuccessResponse {
  success: true;
  response: string;
  room: string;
  created_at: string; // or Date, if parsed
  updated_at: string;
}

interface SendMessageErrorResponse {
  success: false;
  error: string;
}

type SendMessageResponse =
  | SendMessageSuccessResponse
  | SendMessageErrorResponse;

interface ChatMessages {
  uuid: string;
  user: string;
  room: string;
  room_name: string;
  prompt: string | null;
  response: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatHistoryResponse {
  success: boolean;
  message: string;
  count: string | number;
  room_name: string;
  expire_time: string;
  is_time_passed: boolean;
  data: ChatMessages[];
}

interface ChatParams {
  name?: string;
  is_saved?: boolean;
}
interface EditChatParams {
  roomId: string;
  params: ChatParams;
}

interface EditChatResponse {
  success: boolean;
  message: string;
  error?: string;
  data: {
    uuid: string;
    name: string;
    user: string;
    is_saved: boolean;
    is_time_passed: boolean;
    type: 'advisor' | 'agent';
    expire_time: string;
    created_at: string;
    updated_at: string;
  };
}

interface DeleteChatResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface ChatRoom {
  uuid: string;
  name: string;
  user: string;
  is_time_passed: boolean;
  type: 'advisor' | 'agent';
  expire_time: string;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
  display_name: string;
  room_name: string;
}

interface GetChatRoomsResponse {
  success: boolean;
  message: string;
  count: number;
  data: ChatRoom[];
}

interface ExportPdfResponse {
  success: boolean;
  pdf_url: string;
}

interface ChatHistoryParams {
  roomId: string;
  page: number;
  limit: number;
}

interface PendingMessageResponse {
  processing: boolean;
  prompt: string;
  response: string;
  isError: boolean;
}
