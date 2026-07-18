import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import DashboardStack from './stacks/DashboardStack';
import {navigationRef} from './utils/NavigationUtils';
import {getPrefsValue, RouteNames} from '@utils';
// import {STORAGE, TOAST_CONFIG} from '@constants';
import {Alert, View} from 'react-native';
import Toast from 'react-native-toast-message';
import AuthStack from './stacks/AuthStack';
import {STORAGE, TOAST_CONFIG} from '@constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../redux/reduxHook';
import {setCurrentLanguage} from '@redux/app-slice';
import {setIsInternetConnected} from '@redux/app-slice';
import {addEventListener} from '@react-native-community/netinfo';
import {useGetLanguagesQuery} from '@redux/auth-api-slice';
import {getCountry, getLocales} from 'react-native-localize';
const RootNavigation = () => {
  const isLogin = useAppSelector(state => state.app.isLogin);
  const dispatch = useAppDispatch();
  const {refetch: langRefetch} = useGetLanguagesQuery(null);
  const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE) as 'en' | 'de';
  // useEffect(() => {
  //   try {
  //     const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE);
  //     if (!stored) {
  //       let detected: 'en' | 'de' = 'en';
  //       try {
  //         const locale = Intl?.DateTimeFormat?.()?.resolvedOptions?.().locale;
  //         console.log(
  //           'locale ',
  //           Intl?.DateTimeFormat()?.resolvedOptions()?.locale,
  //         );

  //         if (locale && locale.toLowerCase().includes('de')) {
  //           detected = 'de';
  //           Alert.alert(locale, 'user in german');
  //         }
  //       } catch (e) {}
  //       dispatch(setCurrentLanguage(detected));
  //     }
  //   } catch (e) {}
  // }, []);

  useEffect(() => {
    try {
      // const stored = getPrefsValue(STORAGE.CURRENT_LANGUAGE);

      if (!stored) {
        let detected: 'en' | 'de' = 'en';

        try {
          const locale = getLocales()?.[0];

          const isGermanByLanguage = locale?.languageCode === 'de';
          const isGermanByCountry = getCountry() === 'DE';

          if (isGermanByLanguage || isGermanByCountry) {
            detected = 'de';

            // __DEV__ &&
            //   Alert.alert(
            //     'Language detected',
            //     `${locale?.languageTag ?? ''} / ${getCountry()}`,
            //   );
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
  return (
    <NavigationContainer ref={navigationRef}>
      {!isLogin ? <AuthStack /> : <DashboardStack />}
      <Toast
        config={TOAST_CONFIG}
        swipeable={false}
        autoHide={true}
        // visibilityTime={1000}
      />
    </NavigationContainer>
  );
};

export default RootNavigation;
