import {Action, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {REDUCERS} from '../utils/endpoints';
import {Language} from '../utils/Localization/Languages';
import {getPrefsValue, setPrefsValue} from '@utils';
import {STORAGE} from '@constants';
import {useLazyGetResourcesQuery} from './resources-api-slice';

interface ProfileState {
  isLogin: boolean;
  userInfo: UserData | undefined;
  currentLanguage: Language;
  isInternetConnected: boolean;
  languages: LanguageResponse['data'];
  queueMessages: {roomId: string; pending: boolean}[];
}
const getCurrentLang = getPrefsValue(STORAGE.CURRENT_LANGUAGE) || 'en';
const initialState: ProfileState = {
  isLogin: false,
  userInfo: undefined,
  currentLanguage: getCurrentLang as Language,
  isInternetConnected: true,
  languages: [],
  queueMessages: [],
};

const appSlice = createSlice({
  name: REDUCERS.APP,
  initialState,
  reducers: {
    reset(state) {
      return initialState;
    },
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },
    setUserInfo(state, action: PayloadAction<UserData>) {
      state.userInfo = action.payload;
    },
    setCurrentLanguage(state, action: PayloadAction<Language>) {
      console.log('setting the language to ', action);
      state.currentLanguage = action.payload;
      setPrefsValue(STORAGE.CURRENT_LANGUAGE, action.payload);
    },
    setIsInternetConnected(state, action: PayloadAction<boolean>) {
      state.isInternetConnected = action.payload;
    },
    setLanguages(state, action: PayloadAction<LanguageResponse['data']>) {
      state.languages = action.payload;
    },
    setQueueMessages(
      state,
      action: PayloadAction<{roomId: string; pending: boolean}[]>,
    ) {
      state.queueMessages = action.payload;
    },
    addPendingMessage: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      const exists = state.queueMessages.some(q => q.roomId === roomId);
      if (!exists) {
        state.queueMessages.push({roomId, pending: true});
      }
    },
    removePendingMessage: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      state.queueMessages = state.queueMessages.filter(
        q => q.roomId !== roomId,
      );
    },
  },
});

export const {
  setIsLogin,
  setUserInfo,
  reset,
  setCurrentLanguage,
  setIsInternetConnected,
  setLanguages,
  setQueueMessages,
  addPendingMessage,
  removePendingMessage,
} = appSlice.actions;
export default appSlice.reducer;
