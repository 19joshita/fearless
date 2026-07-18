import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackCollection} from '../utils/ScreenCollections';
import {AuthRootStackParamList} from '../utils/types';
import {RouteNames} from '@utils';

const AuthStack = () => {
  const Auth = createNativeStackNavigator<AuthRootStackParamList>();
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {AuthStackCollection?.map((stack, index) => (
        <Auth.Screen
          key={index?.toString()}
          name={stack?.name}
          component={stack?.component}
          options={
            stack.name === RouteNames.LANGUAGE_STACK
              ? {
                  title: 'Language',
                  presentation: 'formSheet',
                  gestureDirection: 'vertical',
                  animation: 'slide_from_bottom',
                  sheetGrabberVisible: true,
                  sheetInitialDetentIndex: 0,
                  sheetAllowedDetents: [0.5, 0.75],
                  sheetCornerRadius: 20,
                  sheetExpandsWhenScrolledToEdge: false,
                  sheetElevation: 24,
                }
              : {}
          }
        />
      ))}
    </Auth.Navigator>
  );
};

export default AuthStack;
