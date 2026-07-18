import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashStackParamList} from '../utils/types';
import {SplashCollection} from '../utils/ScreenCollections';

const SplashStack = () => {
  const Splash = createNativeStackNavigator<SplashStackParamList>();
  return (
    <Splash.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {SplashCollection.map((stack, index) => (
        <Splash.Screen
          key={index?.toString()}
          name={stack.name}
          component={stack.component}
        />
      ))}
    </Splash.Navigator>
  );
};

export default SplashStack;
