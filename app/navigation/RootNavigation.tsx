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
import messaging from '@react-native-firebase/messaging'; // ✅ ADDED: To fetch token directly if MMKV is empty

import useNotifications, {
  getPendingNotification,
  clearPendingNotification,
  handleNotification,
} from '../hooks/useNotifications';
import {useRegisterDeviceTokenMutation} from '@redux/support-chat-slice';
import {navigationRef} from '@navigation-utils';

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

  // HANDLE KILLED STATE NOTIFICATION
  useEffect(() => {
    if (!isLogin) return;

    const pendingData = getPendingNotification();
    if (pendingData) {
      clearPendingNotification();
      handleNotification(pendingData);
    }
  }, [isLogin]);

  useEffect(() => {
    if (!isLogin) return;

    const handleTokenRegistration = async () => {
      try {
        console.log('========================================');
        console.log('🔄 TOKEN REGISTRATION CHECK');
        console.log('========================================');

        let fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);
        if (!fcmToken) {
          console.log(
            '⚠️ FCM Token missing from MMKV, asking Firebase directly...',
          );
          fcmToken = await messaging().getToken();
          if (fcmToken) {
            setPrefsValue(STORAGE.FCM_TOKEN, fcmToken);
          }
        }

        if (!fcmToken) {
          console.log(' No FCM token available at all. Aborting.');
          return;
        }

        fcmToken = fcmToken.trim();

        const currentUserId = getPrefsValue(STORAGE.USER_ID);
        const registeredToken = getPrefsValue(STORAGE.REGISTERED_FCM_TOKEN);
        const registeredUserId = getPrefsValue(STORAGE.REGISTERED_USER_ID);

        // --- CONSOLE LOGS ---
        console.log(
          'Current FCM Token     :',
          fcmToken?.substring(0, 15) + '...',
        );
        console.log('Current User ID       :', currentUserId);
        console.log(
          'Registered FCM Token  :',
          registeredToken?.substring(0, 15) + '...',
        );
        console.log('Registered User ID    :', registeredUserId);
        // ---------------------

        const isTokenChanged = registeredToken !== fcmToken;
        const isUserChanged = registeredUserId !== currentUserId;

        // --- CONSOLE LOGS ---
        console.log('Is Token Changed?     :', isTokenChanged);
        console.log('Is User Changed?      :', isUserChanged);
        // ---------------------

        if (isTokenChanged || isUserChanged) {
          console.log('ACTION: Calling API to register token!');

          await registerDeviceToken({
            device_token: fcmToken,
            device_type: Platform.OS as 'android' | 'ios',
          }).unwrap();
          setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, fcmToken);
          setPrefsValue(STORAGE.REGISTERED_USER_ID, currentUserId || '');
        } else {
          console.log(
            '⏭️ ACTION: Skipping API (Already registered for this user).',
          );
        }
        console.log('========================================\n');
      } catch (error) {
        console.error('❌ API ERROR RESPONSE:', error);
      }
    };

    handleTokenRegistration();
  }, [isLogin, registerDeviceToken]); // Re-run when login status changes

  return (
    <View style={styles.flexContainer}>
      <NavigationContainer ref={navigationRef}>
        {!isLogin ? <AuthStack /> : <DashboardStack />}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default RootNavigation;
