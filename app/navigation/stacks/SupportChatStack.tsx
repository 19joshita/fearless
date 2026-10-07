import {
  // SupportChatCollection,
  SupportChatRootStackParamList,
} from '@navigation-utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RouteNames } from '@utils';
import { View } from 'react-native';

const ResourcesStack = () => {
  const Support = createNativeStackNavigator<SupportChatRootStackParamList>();
  return (
    <Support.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        <View></View>
      {/* {SupportChatCollection?.map((stack:any, index:any) => (
        <Support.Screen
          initialParams={
            stack?.name === RouteNames.SUPPORT_CHAT
              ? { mode: 'admin' } 
              : undefined
          }
          name={stack.name}
          component={stack.component}
          key={index.toString()}
        />
      ))} */}
    </Support.Navigator>
  );
};

export default ResourcesStack;