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
import {reset, setIsLogin, setLanguages, setUserInfo} from './app-slice';
import {translate} from '@localization';
import {store} from './store';

const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.BASE_URL,
  baseUrl: ENDPOINTS?.BASE_URL + ENDPOINTS.SUFFIX,
  prepareHeaders: async (headers, {endpoint}) => {
    if (
      endpoint === 'otpVerification' ||
      endpoint === 'resetPasswordApi' ||
      endpoint === 'updateProfile'
    ) {
      headers.set('Content-Type', 'multipart/form-data');
    } else {
      headers.set('Content-Type', 'application/json');
    }

    const token = getPrefsValue(STORAGE.TOKEN);

    const currentLang =
      getPrefsValue(STORAGE.CURRENT_LANGUAGE) ||
      store.getState().app?.currentLanguage ||
      'en';
    console.log('currentLang===>', currentLang);
    if (token) {
      if (
        endpoint === 'register' ||
        endpoint === 'loginApi' ||
        endpoint === 'passwordForgot'
      ) {
        return headers;
      }
      headers.set('Authorization', `Token ${token}`);
    }
    headers.set('Accept-Language', currentLang);
    console.log('headers===>', headers);
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  console.log('API:', api);
  console.log(result?.error, 'result?.error=====>>');
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
      setPrefsValue(STORAGE?.FCM_TOKEN, '');
      setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, '');
      setPrefsValue(STORAGE.REGISTERED_USER_ID, '');
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

export const authSlice = createApi({
  reducerPath: REDUCERS.AUTH,
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile'],

  endpoints(builder) {
    return {
      register: builder.mutation<SignupResponse, SignUpParams>({
        query: params => {
          return {
            url: `${ENDPOINTS?.REGISTER}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      otpVerify: builder.mutation<VerifyOTPResponse, VerifyOTPParams>({
        query: params => {
          return {
            url: `${ENDPOINTS?.VERIFY_OTP}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      resendOtp: builder.mutation<ResendOTPSuccessResponse, ResendOTPParams>({
        query: params => {
          return {
            url: `${ENDPOINTS?.RESEND_OTP}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),

      forgotOtpVerify: builder.mutation<
        ForgotResetPasswordErrorResponse,
        ForgotResetPasswordParams
      >({
        query: params => {
          return {
            url: `${ENDPOINTS?.FORGOT_PASSWORD_VERIFY}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      loginApi: builder.mutation<LoginResponse, LoginParams>({
        query: param => {
          return {
            url: `${ENDPOINTS.LOGIN}`,
            method: METHOD.POST,
            body: param,
          };
        },
      }),
      passwordForgot: builder.mutation<
        ForgotPasswordResponse,
        ForgotPasswordParams
      >({
        query: params => {
          return {
            url: `${ENDPOINTS.FORGOT_PASSWORD}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      passwordReset: builder.mutation<
        ResetPasswordResponse,
        ResetPasswordParams
      >({
        query: params => {
          return {
            url: `${ENDPOINTS.RESET_PASSWORD}`,
            method: METHOD.PUT,
            body: params,
          };
        },
      }),

      logout: builder.query({
        query: () => {
          return {
            url: `${ENDPOINTS.LOG_OUT}`,
            method: METHOD.POST,
          };
        },
      }),

      getProfile: builder.query<GetProfileResponse, null>({
        query: () => {
          return {
            url: ENDPOINTS.PROFILE,
            method: METHOD.GET,
          };
        },
        providesTags: ['Profile'],

        async onQueryStarted(_, {dispatch, queryFulfilled}) {
          try {
            const {data} = await queryFulfilled;

            if ('success' in data && data?.success) {
              dispatch(setUserInfo(data?.data));
            }
          } catch (err) {
            console.error('Failed to fetch profile:', err);
          }
        },
      }),

      updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
        query: params => {
          return {
            url: ENDPOINTS.PROFILE,
            method: METHOD.PUT,
            body: params,
          };
        },
        invalidatesTags: ['Profile'],
      }),

      deleteProfile: builder.mutation<DeleteProfileResponse, null>({
        query: () => {
          return {
            url: ENDPOINTS.PROFILE,
            method: METHOD.DELETE,
          };
        },
      }),

      changePassword: builder.mutation<
        ChangePasswordResponse,
        ChangePasswordParams
      >({
        query: params => {
          return {
            url: ENDPOINTS.CHANGE_PASSWORD,
            method: METHOD.PUT,
            body: params,
          };
        },
      }),

      getLanguages: builder.query<LanguageResponse, null>({
        query: () => {
          return {
            url: ENDPOINTS.LANGUAGE,
            method: METHOD.GET,
          };
        },
        async onQueryStarted(_, {dispatch, queryFulfilled}) {
          try {
            const {data} = await queryFulfilled;

            if ('success' in data && data?.success) {
              dispatch(setLanguages(data?.data));
            }
          } catch (err) {
            console.error('Failed to fetch profile:', err);
          }
        },
      }),
    };
  },
});

export const {
  useRegisterMutation,
  useOtpVerifyMutation,
  useForgotOtpVerifyMutation,
  useLoginApiMutation,
  usePasswordForgotMutation,
  usePasswordResetMutation,
  useLazyLogoutQuery,
  useResendOtpMutation,
  useLazyGetProfileQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetLanguagesQuery,
  useLazyGetLanguagesQuery,
  useDeleteProfileMutation,
} = authSlice;
