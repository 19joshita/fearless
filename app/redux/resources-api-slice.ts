import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  ENDPOINTS,
  METHOD,
  REDUCERS,
  getPrefsValue,
  setPrefsValue,
} from '@utils';
import {STORAGE, TEXT} from '@constants';
import Toast from 'react-native-toast-message';
import {reset, setIsLogin, setUserInfo} from './app-slice';
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
    const currentLang =
      getPrefsValue(STORAGE.CURRENT_LANGUAGE) ||
      store.getState().app?.currentLanguage ||
      'en';
    if (token) {
      headers.set('Authorization', `Token ${token}`);
    }
    headers.set('Accept-Language', currentLang);
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  console.log(result?.error);
  console.log(api);
  if (result?.error?.status) {
    Toast.show({
      //@ts-ignore
      text1: result?.error?.data?.error,
      type: 'error',
    });
  }

  if (result?.error?.status === 'FETCH_ERROR') {
    Toast.show({
      //@ts-ignore
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

export const resourcesSlice = createApi({
  reducerPath: REDUCERS.RESOURCES,
  baseQuery: baseQueryWithReauth,

  endpoints(builder) {
    return {
      getResources: builder.query<
        ResourcesResponse,
        {page: number; limit: number}
      >({
        query: ({page, limit}) => {
          return {
            url: ENDPOINTS.GET_RESOURCES + 'page=' + page + '&limit=' + limit,
            method: METHOD.GET,
          };
        },
      }),
    };
  },
});

export const {useLazyGetResourcesQuery} = resourcesSlice;
