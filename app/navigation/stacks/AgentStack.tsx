import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AgentTabCollection,
  AgentTabRootStackParamList,
} from '@navigation-utils';
import {RouteNames} from '@utils';

const AgentStack = () => {
  const Agent = createNativeStackNavigator<AgentTabRootStackParamList>();
  return (
    <Agent.Navigator
      initialRouteName={RouteNames.AGENT_CHAT}
      screenOptions={{
        headerShown: false,
      }}>
      {AgentTabCollection?.map((stack, index) => (
        <Agent.Screen
          initialParams={
            stack?.name === RouteNames.AGENT_CHAT ? {type: 'agent'} : undefined
          }
          key={index?.toString()}
          name={stack?.name}
          component={stack?.component}
        />
      ))}
    </Agent.Navigator>
  );
};

export default AgentStack;
