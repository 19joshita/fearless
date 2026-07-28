import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DashboardStack from './stacks/DashboardStack';
import {getPrefsValue, setPrefsValue} from '@utils';
import {Platform, View, StyleSheet} from 'react-native';
import AuthStack from './stacks/AuthStack';
import {STORAGE} from '@constants';
import {useAppDispatch, useAppSelector} from '../redux/reduxHook';
import {setCurrentLanguage, setIsInternetConnected} from '@redux/app-slice';
import {addEventListener} from '@react-native-community/netinfo';
import {useGetLanguagesQuery} from '@redux/auth-api-slice';
import {getCountry, getLocales} from 'react-native-localize';
import messaging from '@react-native-firebase/messaging';

import useNotifications, {
  getPendingNotification,
  clearPendingNotification,
  handleNotification,
} from '../hooks/useNotifications';
import {useRegisterDeviceTokenMutation} from '@redux/support-chat-slice';
import {navigationRef} from '@navigation-utils';
import Toast from 'react-native-toast-message';

const RootNavigation = () => {
  const isLogin = useAppSelector(state => state.app.isLogin);
  const dispatch = useAppDispatch();
  const {refetch: langRefetch} = useGetLanguagesQuery(null);
  const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE) as 'en' | 'de';
  const [registerDeviceToken] = useRegisterDeviceTokenMutation();

  // Initialize notification listeners
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
          if (isGermanByLanguage || isGermanByCountry) detected = 'de';
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
    return () => { unsubscribe(); };
  }, []);

  // HANDLE KILLED STATE NOTIFICATION
  useEffect(() => {
    if (!isLogin) return;
    const pendingData = getPendingNotification();
    if (pendingData) {
      clearPendingNotification();
      setTimeout(() => { handleNotification(pendingData); }, 800);
    }
  }, [isLogin]);

  // ==========================================
  // GENERATE NEW TOKEN & REGISTER API
  // ==========================================
  useEffect(() => {
    if (!isLogin) return;

    const handleTokenRegistration = async () => {
      try {
        let fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);

        // If empty, it means we successfully deleted it on logout!
        // We MUST get a brand new one now.
        if (!fcmToken) {
          console.log('🔑 Old token was deleted. Generating NEW FCM Token...');
          fcmToken = await messaging().getToken();
          if (fcmToken) {
            setPrefsValue(STORAGE.FCM_TOKEN, fcmToken);
          }
        }

        if (!fcmToken) return;
        fcmToken = fcmToken.trim();

        const currentUserId = String(getPrefsValue(STORAGE.USER_ID) || '');
        const registeredToken = getPrefsValue(STORAGE.REGISTERED_FCM_TOKEN) || '';
        const registeredUserId = String(getPrefsValue(STORAGE.REGISTERED_USER_ID) || '');

        // Because ProfileView cleared REGISTERED_USER_ID, this will be TRUE on login
        const isUserChanged = currentUserId !== registeredUserId;
        const isTokenChanged = registeredToken !== fcmToken;

        if (isUserChanged || isTokenChanged) {
          console.log('📝 Sending NEW token to backend for User:', currentUserId);
          
          await registerDeviceToken({
            device_token: fcmToken,
            device_type: Platform.OS as 'android' | 'ios',
          }).unwrap();

          // Remember that we registered this specific token for this specific user
          setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, fcmToken);
          setPrefsValue(STORAGE.REGISTERED_USER_ID, currentUserId);
        }
      } catch (error) {
        console.error('API ERROR RESPONSE:', error);
      }
    };

    handleTokenRegistration();
  }, [isLogin, registerDeviceToken]);

  return (
    <View style={styles.flexContainer}>
      <NavigationContainer ref={navigationRef}>
        {!isLogin ? <AuthStack /> : <DashboardStack />}
      </NavigationContainer>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({ flexContainer: { flex: 1 } });
export default RootNavigation;