import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DashboardRootStackParamList} from '../utils/types';
import {DashboardCollection} from '../utils/ScreenCollections';
import {getPrefsValue, RouteNames} from '@utils';
import {STORAGE} from '@constants';

const DashboardStack = () => {
  const Dashboard = createNativeStackNavigator<DashboardRootStackParamList>();
  const isOnboarded = getPrefsValue(STORAGE.ISONBOARDING) === 'true';
  return (
    <Dashboard.Navigator
      initialRouteName={
        // isOnboarded ? RouteNames.BOTTOM_TABS : RouteNames.WELCOME
        RouteNames.BOTTOM_TABS
      }
      screenOptions={{
        headerShown: false,
      }}>
      {DashboardCollection?.map((stack, index) => (
        <Dashboard.Screen
          key={index?.toString()}
          name={stack?.name}
          component={stack.component}
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
    </Dashboard.Navigator>
  );
};

export default DashboardStack;
