import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OnboardingRootStackParamList } from '../utils/types';
import { OnboardingCollection } from '../utils/ScreenCollections';

const OnboardingStack = () => {
  const Onboarding = createNativeStackNavigator<OnboardingRootStackParamList>();
  return (
    <Onboarding.Navigator>
      {
        OnboardingCollection.map((stack,index) => (
          <Onboarding.Screen key={index?.toString()} name={stack.name} component={stack.component} />
        ))
      }
    </Onboarding.Navigator>
  )
}

export default OnboardingStack