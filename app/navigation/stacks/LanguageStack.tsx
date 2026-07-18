import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LanguageSheet} from '@screens';
import {RouteNames} from '@utils';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const LanguageStack: FC = () => {
  const LangStack = createNativeStackNavigator();
  return (
    <LangStack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
        gestureEnabled: true,
        headerShown: false,
        gestureDirection: 'vertical',
      }}>
      <LangStack.Screen
        name={RouteNames.LANGUAGE_SHEET}
        component={LanguageSheet}
        // options={{
        //   title: 'Profile',
        //   presentation: 'formSheet',
        //   gestureDirection: 'vertical',
        //   animation: 'slide_from_bottom',
        //   sheetGrabberVisible: true,
        //   sheetInitialDetentIndex: 0,
        //   sheetAllowedDetents: [0.5, 0.75, 1],
        //   sheetCornerRadius: 20,
        //   sheetExpandsWhenScrolledToEdge: true,
        //   sheetElevation: 24,
        // }}
      />
    </LangStack.Navigator>
  );
};

export default LanguageStack;
