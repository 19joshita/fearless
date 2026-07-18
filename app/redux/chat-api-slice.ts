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
import {
  addPendingMessage,
  removePendingMessage,
  reset,
  setIsLogin,
} from './app-slice';
import {translate} from '@localization';
import {store} from './store';

const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.BASE_URL,
  baseUrl: ENDPOINTS?.BASE_URL + ENDPOINTS.SUFFIX,
  prepareHeaders: async (headers, {endpoint}) => {
    if (endpoint === 'updateProfile') {
      headers.set('Content-Type', 'multipart/form-data');
    } else {
      headers.set('Content-Type', 'application/json');
    }

    const token = getPrefsValue(STORAGE.TOKEN);
    console.log('token ', token);
    const currentLang =
      getPrefsValue(STORAGE.CURRENT_LANGUAGE) ||
      store.getState().app?.currentLanguage ||
      'en';
    console.log('clll ', currentLang, endpoint);
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
  // console.log(api?.endpoint === 'getMessages' , result?.error?.data?.isRoom);
  if (
    result?.error?.status &&
    api?.endpoint !== 'getMessages' &&
    result?.error?.status !== 'PARSING_ERROR' &&
    result?.error?.status !== 'FETCH_ERROR'
  ) {
    Toast.show({
      //@ts-ignore
      text1: result?.error?.data?.error,
      type: 'error',
    });
  }

  // if (result?.error?.status === 'FETCH_ERROR') {
  //   Toast.show({
  //     //@ts-ignore
  //     text1: translate('NO_INTERNET'),
  //     type: 'error',
  //   });
  // }

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

export const chatSlice = createApi({
  reducerPath: REDUCERS.CHAT,
  baseQuery: baseQueryWithReauth,

  endpoints(builder) {
    return {
      createChatRoom: builder.mutation<
        CreateRoomResponse,
        {type: 'agent' | 'advisor'}
      >({
        query: ({type}) => {
          return {
            url: ENDPOINTS.CREATE_CHAT_RROM,
            method: METHOD.POST,
            body: {type: type},
          };
        },
      }),

      sendMessage: builder.mutation<SendMessageResponse, SendMessageParams>({
        query: ({roomId, params, isAgent}) => {
          const endpoint = isAgent
            ? ENDPOINTS.SEND_MESSAGE_AGENT
            : ENDPOINTS.SEND_MESSAGE;
          return {
            url: endpoint + roomId,
            method: METHOD.POST,
            body: params,
          };
        },
        async onQueryStarted({roomId}, {dispatch, queryFulfilled}) {
          console.log('dispatching ', roomId);
          dispatch(addPendingMessage(roomId));

          try {
            await queryFulfilled;
            dispatch(removePendingMessage(roomId));
          } catch (err) {
            console.error('error', err);
            dispatch(removePendingMessage(roomId));
          }
        },
      }),

      getMessages: builder.query<ChatHistoryResponse, ChatHistoryParams>({
        query: ({roomId, page, limit}) => {
          return {
            url:
              ENDPOINTS.FETCH_MESSAGES +
              roomId +
              '?page=' +
              page +
              '&limit=' +
              limit,
            method: METHOD.GET,
          };
        },
      }),

      editChat: builder.mutation<EditChatResponse, EditChatParams>({
        query: ({roomId, params}) => {
          return {
            url: ENDPOINTS.EDIT_CHAT + roomId,
            method: METHOD.PUT,
            body: params,
          };
        },
      }),

      deleteChat: builder.mutation<DeleteChatResponse, string>({
        query: roomId => {
          return {
            url: ENDPOINTS.EDIT_CHAT + roomId,
            method: METHOD.DELETE,
          };
        },
      }),

      getRooms: builder.query<GetChatRoomsResponse, string>({
        query: page => {
          return {
            url: ENDPOINTS.GET_ROOMS + 'page=' + page + '&limit=10',
            method: METHOD.GET,
          };
        },
      }),

      exportChat: builder.query<ExportPdfResponse, string>({
        query: (roomId: string) => {
          return {
            url: ENDPOINTS.FETCH_MESSAGES + roomId + ENDPOINTS.EXPORT_CHAT,
            method: METHOD.GET,
            // responseHandler: (response: Response) => response.arrayBuffer(), // ✅ treat response as binary
            // responseType: 'arraybuffer', // ✅ tell fetchBaseQuery to expect binary
            // headers: {
            //   Accept: 'application/pdf',
            // },
          };
        },
      }),

      pendingMessage: builder.query<PendingMessageResponse, string>({
        query: (roomId: string) => {
          return {
            url: ENDPOINTS.PENDING_MESSAGES + roomId,
            method: METHOD.GET,
          };
        },
      }),
    };
  },
});

export const {
  useCreateChatRoomMutation,
  useSendMessageMutation,
  useLazyGetMessagesQuery,
  useEditChatMutation,
  useDeleteChatMutation,
  useLazyExportChatQuery,
  useLazyGetRoomsQuery,
  useLazyPendingMessageQuery,
} = chatSlice;
