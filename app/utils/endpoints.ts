const ENDPOINTS = {
  BASE_URL: 'https://app.fearlesscode.de',
  SUFFIX: '/api/v1/',

  // Authentication
  LOGIN: 'auth/login',
  VERIFY_OTP: 'auth/verify-otp',
  REGISTER: 'auth/register',
  RESEND_OTP: 'auth/resend-otp',
  FORGOT_PASSWORD: 'auth/forget-password',
  FORGOT_PASSWORD_VERIFY: 'auth/reset-verify-otp',
  RESET_PASSWORD: 'auth/reset-password',
  PROFILE: 'manage-profile',
  DELETE_PROFILE: 'user/delete',
  CHANGE_PASSWORD: 'change-password',
  LANGUAGE: 'languages',
  LOG_OUT: 'auth/logout',

  // Existing Chat
  CREATE_CHAT_RROM: 'chat/room',
  SEND_MESSAGE: 'chat/message/',
  SEND_MESSAGE_AGENT: 'agents/chat/message/',
  FETCH_MESSAGES: 'room/messages/',
  EDIT_CHAT: 'chat/room?room_uuid=',
  EXPORT_CHAT: '/export-pdf',
  GET_ROOMS: 'rooms?',
  GET_RESOURCES: 'resources?',
  PENDING_MESSAGES: 'pending/request/',

  // ==========================
  // Support Chat APIs
  // ==========================

  // Get all conversations
  SUPPORT_CHAT_CONVERSATION: '/support-chat/conversation',
  SUPPORT_CHAT_ADMIN_CONVERSATION: '/support-chat/admin/conversations',
  SUPPORT_CHAT_CONVERSATIONS: '/support-chat/conversations/',
  SUPPORT_CHAT_SEND_MESSAGE: '/support-chat/send-message',
  SUPPORT_CHAT_UPLOAD: '/support-chat/upload',
  SUPPORT_CHAT_READ: '/support-chat/read',
  SUPPORT_CHAT_UNREAD_COUNT: '/support-chat/unread-count',
  SUPPORT_CHAT_DEVICE_TOKEN: '/support-chat/device-token',
  SUPPORT_CHAT_MESSAGES: '/support-chat/messages',
};

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

const REDUCERS = {
  APP: 'app',
  AUTH: 'auth',
  CHAT: 'chat',
  RESOURCES: 'resources',
  SUPPORT_CHAT: 'supportChatApi',
};

export {ENDPOINTS, METHOD, REDUCERS};
