import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DashboardStack from './stacks/DashboardStack';
import {getPrefsValue, setPrefsValue} from '@utils';
import {View, StyleSheet} from 'react-native';
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
// ✅ REMOVED: useRegisterDeviceTokenMutation (No longer needed)
import {navigationRef} from '@navigation-utils';
import Toast from 'react-native-toast-message';

const RootNavigation = () => {
  const isLogin = useAppSelector(state => state.app.isLogin);
  const dispatch = useAppDispatch();
  const {refetch: langRefetch} = useGetLanguagesQuery(null);
  const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE) as 'en' | 'de';
  // ✅ REMOVED: const [registerDeviceToken] = useRegisterDeviceTokenMutation();

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
      setTimeout(() => {
        handleNotification(pendingData);
      }, 800);
    }
  }, [isLogin]);

  // ==========================================
  // ✅ NEW APPROACH: ENSURE FCM TOKEN EXISTS LOCALLY
  // ==========================================
  useEffect(() => {
    if (!isLogin) return;

    const ensureFcmToken = async () => {
      let fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);

      // If empty, it means we successfully deleted it on logout!
      // We MUST get a brand new one now.
      if (!fcmToken) {
        console.log('🔑 Old token was deleted. Generating NEW FCM Token...');
        try {
          fcmToken = await messaging().getToken();
          if (fcmToken) {
            setPrefsValue(STORAGE.FCM_TOKEN, fcmToken.trim());
          }
        } catch (error) {
          console.error('Failed to get FCM token:', error);
        }
      }
      
      // THAT'S IT! 
      // The backend middleware will automatically grab this token from the 
      // X-Device-Token header (attached in auth-api-slice.ts) the next time 
      // any API call runs (e.g., getProfile).
    };

    // Small delay to ensure navigation stack is fully ready
    const timer = setTimeout(ensureFcmToken, 500);
    return () => clearTimeout(timer);
  }, [isLogin]); // ✅ Removed registerDeviceToken dependency

  return (
    <View style={styles.flexContainer}>
      <NavigationContainer ref={navigationRef}>
        {!isLogin ? <AuthStack /> : <DashboardStack />}
      </NavigationContainer>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({flexContainer: {flex: 1}});
export default RootNavigation;