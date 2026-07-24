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
  handleNotification, // ⚠️ FIX 4: Import the handler
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

  // LANGUAGE & INTERNET LOGIC
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
  // ⚠️ FIX 5: HANDLE KILLED STATE NOTIFICATION
  // ==========================================
  useEffect(() => {
    if (!isLogin) return;

    // When user logs in, check if the app was opened via a notification while killed
    const pendingData = getPendingNotification();
    if (pendingData) {
      clearPendingNotification(); // Clear immediately to prevent loops
      handleNotification(pendingData); // Trigger navigation
    }
  }, [isLogin]);

  // ==========================================
  // API INTEGRATION (Cleaned up duplicate)
  // ==========================================
  useEffect(() => {
    if (!isLogin) return;

    const handleTokenRegistration = async () => {
      try {
        let fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);
        if (fcmToken) {
          fcmToken = fcmToken.trim(); // Clean whitespace
        }

        console.log('Cleaned FCM Token for API:', fcmToken);
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

  return (
    <NavigationContainer ref={navigationRef}>
      {!isLogin ? <AuthStack /> : <DashboardStack />}
      <Toast config={TOAST_CONFIG} swipeable={false} autoHide={true} />
    </NavigationContainer>
  );
};

export default RootNavigation;
