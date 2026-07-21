import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DashboardStack from './stacks/DashboardStack';
import {getPrefsValue, setPrefsValue, RouteNames} from '@utils';
import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import AuthStack from './stacks/AuthStack';
import {STORAGE, TOAST_CONFIG} from '@constants';
import {useAppDispatch, useAppSelector} from '../redux/reduxHook';
import {setCurrentLanguage} from '@redux/app-slice';
import {setIsInternetConnected} from '@redux/app-slice';
import {addEventListener} from '@react-native-community/netinfo';
import {useGetLanguagesQuery} from '@redux/auth-api-slice';
import {getCountry, getLocales} from 'react-native-localize';

import useNotifications, {
  getPendingNotification,
  clearPendingNotification,
} from '../hooks/useNotifications';
import {useRegisterDeviceTokenMutation} from '@redux/support-chat-slice';
import {navigate, navigationRef} from '@navigation-utils';

const RootNavigation = () => {
  const isLogin = useAppSelector(state => state.app.isLogin);
  const dispatch = useAppDispatch();
  const {refetch: langRefetch} = useGetLanguagesQuery(null);
  const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE) as 'en' | 'de';
  const [registerDeviceToken] = useRegisterDeviceTokenMutation();
  useNotifications();
  // LANGUAGE & INTERNET LOGIC (Unchanged)
  useEffect(() => {
    try {
      if (!stored) {
        let detected: 'en' | 'de' = 'en';
        try {
          const locale = getLocales()?.[0];
          const isGermanByLanguage = locale?.languageCode === 'de';
          const isGermanByCountry = getCountry() === 'DE';
          if (isGermanByLanguage || isGermanByCountry) {
            detected = 'de';
          }
        } catch (e) {
          console.error('Language error ', e);
          dispatch(setCurrentLanguage(stored || 'en'));
        }
        dispatch(setCurrentLanguage(detected));
      }
    } catch (e) {
      console.error('Language error ', e);
      dispatch(setCurrentLanguage(stored || 'en'));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (state?.isConnected) {
        langRefetch();
        dispatch(setIsInternetConnected(state?.isConnected));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // ==========================================
  //  API INTEGRATION (Reads token saved by the Alert popup)
  // ==========================================
  useEffect(() => {
    if (!isLogin) return;

    const handleTokenRegistration = async () => {
      try {
        const fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);
        console.log('FCM Token for API:', fcmToken);

        if (!fcmToken) return;

        const registeredToken = getPrefsValue(STORAGE.REGISTERED_FCM_TOKEN);

        if (registeredToken !== fcmToken) {
          console.log('Calling Register Device Token API...');

          const response = await registerDeviceToken({
            device_token: fcmToken,
            device_type: Platform.OS as 'android' | 'ios',
          }).unwrap();

          console.log('API SUCCESS RESPONSE:', JSON.stringify(response));
          await setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, fcmToken);
        } else {
          console.log('Token already registered, skipping API.');
        }
      } catch (error) {
        console.error('API ERROR RESPONSE:', error);
      }
    };

    handleTokenRegistration();
  }, [isLogin, registerDeviceToken]);

  // ==========================================
  // PENDING NOTIFICATION LOGIC
  // ==========================================
  useEffect(() => {
    if (isLogin) {
      const timer = setTimeout(() => {
        const pendingData = getPendingNotification();

        if (pendingData) {
          console.log('Dashboard is mounted! Processing notification...');
          clearPendingNotification();

          const token = getPrefsValue(STORAGE.TOKEN);
          if (!token) return;

          if (
            pendingData?.type === 'support_chat' &&
            pendingData?.conversationId
          ) {
            const userData = getPrefsValue(STORAGE.USER_DATA);
            let userInfo = null;
            try {
              userInfo = userData ? JSON.parse(userData) : null;
            } catch (e) {}

            if (userInfo?.role === 'admin') {
              navigate(RouteNames.USER_LIST);
            } else {
              navigate(RouteNames.SUPPORT_CHAT, {
                mode: 'user',
                conversationId: pendingData.conversationId,
                userName: userInfo?.name,
              });
            }
          }
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  return (
    <NavigationContainer ref={navigationRef}>
      {!isLogin ? <AuthStack /> : <DashboardStack />}
      <Toast config={TOAST_CONFIG} swipeable={false} autoHide={true} />
    </NavigationContainer>
  );
};

export default RootNavigation;
