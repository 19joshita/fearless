import {
  ResourcesTabRootStackParamList,
  ResourceTabCollection,
} from '@navigation-utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '@utils';

const ResourcesStack = () => {
  const Resources =
    createNativeStackNavigator<ResourcesTabRootStackParamList>();
  return (
    <Resources.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {ResourceTabCollection?.map((stack, index) => (
        <Resources.Screen
          initialParams={
            stack?.name === RouteNames.ASSISTANT_CHAT
              ? {isAssitant: true, type: 'agent'}
              : undefined
          }
          name={stack.name}
          component={stack.component}
          key={index.toString()}
        />
      ))}
    </Resources.Navigator>
  );
};

export default ResourcesStack;
