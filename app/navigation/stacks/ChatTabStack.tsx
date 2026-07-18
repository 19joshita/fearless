import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AuthStackCollection,
  ChatTabCollection,
} from '../utils/ScreenCollections';
import {
  AuthRootStackParamList,
  ChatTabRootStackParamList,
} from '../utils/types';
import {RouteNames} from '@utils';

const ChatTabStack = () => {
  const ChatStack = createNativeStackNavigator<ChatTabRootStackParamList>();
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {ChatTabCollection?.map((stack, index) => (
        <ChatStack.Screen
          initialParams={
            stack?.name === RouteNames.CHAT_TAB ? {type: 'advisor'} : undefined
          }
          key={index?.toString()}
          name={stack?.name}
          component={stack?.component}
        />
      ))}
    </ChatStack.Navigator>
  );
};

export default ChatTabStack;
