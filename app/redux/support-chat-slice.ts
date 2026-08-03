import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  ENDPOINTS,
  METHOD,
  REDUCERS,
  getPrefsValue,
  setPrefsValue,
} from '@utils';
import {STORAGE} from '@constants';
import Toast from 'react-native-toast-message';
import {reset, setIsLogin} from './app-slice';
import {translate} from '@localization';
import {store} from './store';
import type {
  GetAdminConversationsParams,
  GetAdminConversationsResponse,
  CreateConversationResponse,
  GetMessagesParams,
  GetMessagesResponse,
  SendMessageParams,
  SendMessageResponse,
  UploadFileResponse,
  ReadConversationParams,
  ReadConversationResponse,
  UnreadCountResponse,
  DeviceTokenParams,
  DeviceTokenResponse,
  DeleteMessageParams,
  DeleteMessageResponse,
  UpdateMessageParams,
  UpdateMessageResponse,
  DeleteConversationParams,
  DeleteConversationResponse,
  MarkMessagesAsReadParams,
  MarkMessagesAsReadResponse,
  ReadConversationByIdResponse,
  ReadConversationByIdParams,
} from 'types/support-chat';

const baseQuery = fetchBaseQuery({
  baseUrl: ENDPOINTS?.BASE_URL + ENDPOINTS.SUFFIX,
  prepareHeaders: async (headers, {endpoint}) => {
    if (endpoint === 'uploadSupportChatFile') {
      headers.delete('Content-Type');
    } else {
      headers.set('Content-Type', 'application/json');
    }

    const token = getPrefsValue(STORAGE.TOKEN);
    const currentLang =
      getPrefsValue(STORAGE.CURRENT_LANGUAGE) ||
      store.getState().app?.currentLanguage ||
      'en';

    if (token) {
      headers.set('Authorization', `Token ${token}`);
    }
    headers.set('Accept-Language', currentLang);
    headers.set('Connection', 'keep-alive');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  if (
    result?.error?.status &&
    api?.endpoint !== 'getSupportChatMessages' &&
    result?.error?.status !== 'PARSING_ERROR' &&
    result?.error?.status !== 'FETCH_ERROR'
  ) {
  }

  if (result?.error?.status === 'FETCH_ERROR') {
    Toast.show({
      text1: translate('NO_INTERNET'),
      type: 'error',
    });
  }

  if (result.error?.status === 401 || result?.meta?.response?.status === 401) {
    setTimeout(() => {
      setPrefsValue(STORAGE?.ISLOGGED, '');
      setPrefsValue(STORAGE?.TOKEN, '');
      api?.dispatch(setIsLogin(false));
      api?.dispatch(reset());
    }, 200);

    Toast.show({
      text1: translate('UNAUTHORIZED_ACCESS'),
      type: 'error',
    });
  }

  return result;
};

export const supportChatSlice = createApi({
  reducerPath: REDUCERS.SUPPORT_CHAT,
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SupportChat'],

  endpoints: builder => ({
    // ==================== ADMIN: Get All Conversations List ====================
    getAdminConversations: builder.query<
      GetAdminConversationsResponse,
      GetAdminConversationsParams
    >({
      query: ({page, limit}) => ({
        url: ENDPOINTS.SUPPORT_CHAT_ADMIN_CONVERSATION,
        method: METHOD.GET,
        params: {
          page,
          limit,
        },
      }),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({conversation_id}) => ({
                type: 'SupportChat' as const,
                id: `Conversation-${conversation_id}`,
              })),
              {type: 'SupportChat', id: 'LIST'},
            ]
          : [{type: 'SupportChat', id: 'LIST'}],
      serializeQueryArgs: ({endpointName}) => {
        return endpointName;
      },
      merge: (currentCache, newCache) => {
        const existingIds = new Set(
          currentCache.data?.map(c => c.conversation_id) || [],
        );
        const newItems = newCache.data.filter(
          c => !existingIds.has(c.conversation_id),
        );
        currentCache.data = [...(currentCache.data || []), ...newItems];
      },
    }),

    // ==================== USER: Create/Get Conversation ====================
    createConversation: builder.mutation<CreateConversationResponse, void>({
      query: () => ({
        url: ENDPOINTS.SUPPORT_CHAT_CONVERSATION,
        method: METHOD.POST,
      }),
      invalidatesTags: [{type: 'SupportChat', id: 'LIST'}],
    }),

    // ==================== Get Messages ====================
    getSupportChatMessages: builder.query<
      GetMessagesResponse,
      GetMessagesParams
    >({
      query: ({conversationId, page, limit}) => ({
        url: `${ENDPOINTS.SUPPORT_CHAT_CONVERSATIONS}${conversationId}/messages`,
        method: METHOD.GET,
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result, error, {conversationId}) => [
        {type: 'SupportChat', id: `Messages-${conversationId}`},
      ],
      serializeQueryArgs: ({endpointName, queryArgs}) => {
        return `${endpointName}-${queryArgs.conversationId}-${
          queryArgs.limit || 20
        }`;
      },
    }),

    // ==================== Send Message ====================
    sendSupportMessage: builder.mutation<
      SendMessageResponse,
      SendMessageParams
    >({
      query: params => ({
        url: ENDPOINTS.SUPPORT_CHAT_SEND_MESSAGE,
        method: METHOD.POST,
        body: params,
      }),
      invalidatesTags: (result, error, {conversation_id}) => [
        {type: 'SupportChat', id: 'LIST'},
        {type: 'SupportChat', id: `Messages-${conversation_id}`},
        {type: 'SupportChat', id: `Conversation-${conversation_id}`},
      ],
    }),

    // ==================== Upload File ====================
    uploadSupportChatFile: builder.mutation<any, FormData>({
      query: formData => ({
        url: ENDPOINTS.SUPPORT_CHAT_UPLOAD,
        method: METHOD.POST,
        body: formData,
      }),
      transformResponse: (response: any) => {
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.log('Upload Error:', JSON.stringify(error, null, 2));
        return error;
      },
    }),

    // ==================== Mark Conversation As Read (Existing) ====================
    markConversationAsRead: builder.mutation<
      ReadConversationResponse,
      ReadConversationParams
    >({
      query: params => ({
        url: ENDPOINTS.SUPPORT_CHAT_READ,
        method: METHOD.POST,
        body: params,
      }),
      invalidatesTags: (result, error, {conversation_id}) => [
        {type: 'SupportChat', id: `Conversation-${conversation_id}`},
        {type: 'SupportChat', id: `Messages-${conversation_id}`},
      ],
      async onQueryStarted({conversation_id}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          supportChatSlice.util.updateQueryData(
            'getSupportChatMessages',
            {conversationId: conversation_id, page: 1, limit: 20},
            draft => {
              if (draft.data) {
                draft.data.messages = draft.data.messages.map(m => ({
                  ...m,
                  status: 'read' as const,
                }));
              }
            },
          ),
        );

        const patchAdminList = dispatch(
          supportChatSlice.util.updateQueryData(
            'getAdminConversations',
            {page: 1, limit: 10},
            draft => {
              if (draft.data) {
                const convo = draft.data.find(
                  c => c.conversation_id === Number(conversation_id),
                );
                if (convo) {
                  convo.unread_count = 0;
                }
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          patchAdminList.undo();
        }
      },
    }),

    // ====================  NEW: Mark Specific Messages As Read ====================
    markMessagesAsRead: builder.mutation<
      MarkMessagesAsReadResponse,
      MarkMessagesAsReadParams
    >({
      query: ({conversationId, message_ids}) => ({
        url: `support-chat/${conversationId}/mark-read/`,
        method: METHOD.POST,
        body: {message_ids},
      }),
      invalidatesTags: (result, error, {conversationId}) => [
        {type: 'SupportChat', id: `Messages-${conversationId}`},
        {type: 'SupportChat', id: `Conversation-${conversationId}`},
      ],
      async onQueryStarted(
        {conversationId, message_ids},
        {dispatch, queryFulfilled},
      ) {
        const patchMessages = dispatch(
          supportChatSlice.util.updateQueryData(
            'getSupportChatMessages',
            {conversationId, page: 1, limit: 20},
            draft => {
              if (draft.data?.messages) {
                const messageIdsSet = new Set(message_ids);
                draft.data.messages = draft.data.messages.map(m =>
                  messageIdsSet.has(m.id) ? {...m, status: 'read' as const} : m,
                );
              }
            },
          ),
        );

        const patchAdminList = dispatch(
          supportChatSlice.util.updateQueryData(
            'getAdminConversations',
            {page: 1, limit: 10},
            draft => {
              if (draft.data) {
                const convo = draft.data.find(
                  c => c.conversation_id === Number(conversationId),
                );
                if (convo) {
                  convo.unread_count = 0;
                }
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchMessages.undo();
          patchAdminList.undo();
        }
      },
    }),

    readConversation: builder.mutation<
      ReadConversationByIdResponse,
      ReadConversationByIdParams
    >({
      query: body => ({
        url: ENDPOINTS.SUPPORT_CHAT_READ,
        method: METHOD.POST,
        body,
      }),
      invalidatesTags: (result, error, {conversation_id}) => [
        {type: 'SupportChat', id: 'LIST'},
        {type: 'SupportChat', id: `Conversation-${conversation_id}`},
        {type: 'SupportChat', id: `Messages-${conversation_id}`},
      ],
    }),

    // ==================== Get Unread Count =====================
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: ENDPOINTS.SUPPORT_CHAT_UNREAD_COUNT,
        method: METHOD.GET,
      }),
      providesTags: [{type: 'SupportChat', id: 'UnreadCount'}],
    }),

    // ==================== Register Device Token ====================
    registerDeviceToken: builder.mutation<
      DeviceTokenResponse,
      DeviceTokenParams
    >({
      query: params => ({
        url: ENDPOINTS.SUPPORT_CHAT_DEVICE_TOKEN,
        method: METHOD.POST,
        body: params,
      }),
    }),

    // ==================== Delete Message ====================
    deleteMessage: builder.mutation<DeleteMessageResponse, DeleteMessageParams>(
      {
        query: ({messageId}) => ({
          url: `support-chat/messages/${messageId}`,
          method: METHOD.DELETE,
        }),
        invalidatesTags: (result, error, {conversationId}) => [
          {type: 'SupportChat', id: `Messages-${conversationId}`},
          {type: 'SupportChat', id: 'LIST'},
        ],
        async onQueryStarted(
          {messageId, conversationId},
          {dispatch, queryFulfilled},
        ) {
          const patchResult = dispatch(
            supportChatSlice.util.updateQueryData(
              'getSupportChatMessages',
              {conversationId, page: 1, limit: 20},
              draft => {
                if (draft.data?.messages) {
                  draft.data.messages = draft.data.messages.filter(
                    m => m.id !== messageId,
                  );
                }
              },
            ),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      },
    ),

    // ==================== Update Message ====================
    updateSupportMessage: builder.mutation<
      UpdateMessageResponse,
      UpdateMessageParams
    >({
      query: ({messageId, ...body}) => ({
        url: `support-chat/messages/${messageId}`,
        method: METHOD.PUT,
        body: body,
      }),
      invalidatesTags: (result, error, {conversationId}) => [
        {type: 'SupportChat', id: `Messages-${conversationId}`},
      ],
    }),

    // ==================== DELETE CONVERSATION ====================
    deleteConversation: builder.mutation<
      DeleteConversationResponse,
      DeleteConversationParams
    >({
      query: ({conversationId}) => ({
        url: `support-chat/conversations/${conversationId}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: (result, error, {conversationId}) => [
        {type: 'SupportChat', id: 'LIST'},
        {type: 'SupportChat', id: `Conversation-${conversationId}`},
        {type: 'SupportChat', id: `Messages-${conversationId}`},
      ],
      async onQueryStarted({conversationId}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          supportChatSlice.util.updateQueryData(
            'getAdminConversations',
            {page: 1, limit: 10},
            draft => {
              if (draft.data) {
                draft.data = draft.data.filter(
                  c => c.conversation_id !== conversationId,
                );
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAdminConversationsQuery,
  useLazyGetAdminConversationsQuery,
  useCreateConversationMutation,
  useGetSupportChatMessagesQuery,
  useLazyGetSupportChatMessagesQuery,
  useSendSupportMessageMutation,
  useUploadSupportChatFileMutation,
  useMarkConversationAsReadMutation,
  useMarkMessagesAsReadMutation,
  useReadConversationMutation,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
  useRegisterDeviceTokenMutation,
  useDeleteMessageMutation,
  useUpdateSupportMessageMutation,
  useDeleteConversationMutation,
} = supportChatSlice;
