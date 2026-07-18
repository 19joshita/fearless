import {combineReducers, configureStore} from '@reduxjs/toolkit';
import appSlice from './app-slice';
import {authSlice} from './auth-api-slice';
import {chatSlice} from './chat-api-slice';
import {resourcesSlice} from './resources-api-slice';
import {supportChatSlice} from './support-chat-slice';
import reduxStorage from './storage';
import {persistReducer, persistStore} from 'redux-persist';
import {setupListeners} from '@reduxjs/toolkit/query';

const persistConfig = {
  key: 'app',
  storage: reduxStorage,
  blacklist: ['isInternetConnected', 'isLogin'],
};

const persistedAppReducer = persistReducer(persistConfig, appSlice);

const reducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [chatSlice.reducerPath]: chatSlice.reducer,
  [resourcesSlice.reducerPath]: resourcesSlice.reducer,
  [supportChatSlice.reducerPath]: supportChatSlice.reducer, // <-- 2. Add to reducers
  app: persistedAppReducer,
});

export const store = configureStore({
  reducer: reducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(authSlice.middleware)
      .concat(chatSlice.middleware)
      .concat(resourcesSlice.middleware)
      .concat(supportChatSlice.middleware); // <-- 3. Add to middleware
  },
});
setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;