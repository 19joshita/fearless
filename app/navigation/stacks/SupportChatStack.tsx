import {
  SupportChatCollection,
  SupportChatRootStackParamList,
} from '@navigation-utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RouteNames } from '@utils';

const ResourcesStack = () => {
  const Support = createNativeStackNavigator<SupportChatRootStackParamList>();
  return (
    <Support.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {SupportChatCollection?.map((stack, index) => (
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
      ))}
    </Support.Navigator>
  );
};

export default ResourcesStack;