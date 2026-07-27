import React, {useEffect, useState} from 'react'; // <-- ADDED useState
import {NavigationContainer} from '@react-navigation/native';
import DashboardStack from './stacks/DashboardStack';
import {getPrefsValue, setPrefsValue, RouteNames} from '@utils';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  StyleSheet,
} from 'react-native'; // <-- ADDED UI imports
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

  const [visibleToken, setVisibleToken] = useState<any>(null);

  // <-- CHANGED: Pass callback to hook to get token instantly
  //@ts-ignore
  useNotifications(token => {
    console.log('Token received in RootNavigation:', token);
    setVisibleToken(token);
  });

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

  // API INTEGRATION
  useEffect(() => {
    if (!isLogin) return;

    const handleTokenRegistration = async () => {
      try {
        let fcmToken = getPrefsValue(STORAGE.FCM_TOKEN);

        if (fcmToken) {
          fcmToken = fcmToken.trim();
        }
        setVisibleToken(fcmToken);

        if (!fcmToken) return;

        const registeredToken = getPrefsValue(STORAGE.REGISTERED_FCM_TOKEN);

        if (registeredToken !== fcmToken) {
          const response = await registerDeviceToken({
            device_token: fcmToken,
            device_type: Platform.OS as 'android' | 'ios',
          }).unwrap();

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

  // <-- ADDED: Copy function
  const copyTokenToClipboard = () => {
    if (visibleToken) {
      Clipboard.setString(visibleToken);
      Toast.show({
        type: 'success',
        text1: 'Token Copied to Clipboard!',
        position: 'top',
      });
    }
  };

  return (
    // <-- WRAPPED IN VIEW
    <View style={styles.flexContainer}>
      <NavigationContainer ref={navigationRef}>
        {!isLogin ? <AuthStack /> : <DashboardStack />}
      </NavigationContainer>
    </View>
  );
};

// <-- ADDED: Styles
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  tokenBox: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 40, 0, 0.95)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00FF00',
    zIndex: 9999,
    elevation: 9999,
  },
  tokenLabel: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tokenText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});

export default RootNavigation;
