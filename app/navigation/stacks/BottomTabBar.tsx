// Navigation/BottomTabNavigator.tsx
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from 'react-native';
import {RouteNames, useText} from '@utils';
import {
  ICON_AGENTS_ACTIVE,
  ICON_AGENTS_INACTIVE,
  ICON_CHAT_ACTIVE,
  ICON_CHAT_INACTIVE,
  ICON_PROFILE_ACTIVE,
  ICON_PROFILE_INACTIVE,
  ICON_RESOURCES_ACTIVE,
  ICON_RESOURCES_INACTIVE,
} from '@assets/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize} from '@theme';
import ChatTabStack from './ChatTabStack';
import {ProfileView, SupportChat} from '@screens';
import {useGetLanguagesQuery, useGetProfileQuery} from '@redux/auth-api-slice';
import AgentStack from './AgentStack';
import ResourcesStack from './ResourcesStack';
import {addEventListener} from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setCurrentLanguage, setIsInternetConnected} from '@redux/app-slice';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
  const {bottom} = useSafeAreaInsets();
  const {data, refetch} = useGetProfileQuery(null);

  const {TEXT} = useText();

  const {refetch: langRefetch, data: lD} = useGetLanguagesQuery(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (data && 'data' in data) {
  //     if (data?.data?.language) {
  //       dispatch(setCurrentLanguage(data?.data?.language));
  //     }
  //   }
  // }, [data]);
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (state?.isConnected) {
        refetch();
        langRefetch();
        dispatch(setIsInternetConnected(state?.isConnected));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.SECONDARY_COLOR,
        tabBarButton: props => (
          //@ts-ignore
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: COLORS.TABS_BG,
          height: scaleSize(70) + bottom,
          // paddingBottom: bottom,
          paddingTop: scaleSize(8),
          // marginBottom: bottom || undefined,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: scaleSize(30),
          borderTopRightRadius: scaleSize(30),
          borderWidth: 0,
          overflow: 'hidden',
          //   paddingBottom: 0,
        },
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontSize: FONT_VARIENTS.p,
          // includeFontPadding: false,
          fontFamily: FONT_FAMILY.Medium,
        },

        tabBarIcon: ({focused, color, size}) => {
          let ICON = ICON_CHAT_ACTIVE;

          switch (route.name) {
            case RouteNames.CHAT_TAB:
              ICON = focused ? ICON_CHAT_ACTIVE : ICON_CHAT_INACTIVE;
              break;
            case RouteNames.AGENT_TAB:
              ICON = focused ? ICON_AGENTS_ACTIVE : ICON_AGENTS_INACTIVE;
              break;
            case RouteNames.RESOURCES_TAB:
              ICON = focused ? ICON_RESOURCES_ACTIVE : ICON_RESOURCES_INACTIVE;
              break;
            case RouteNames.PROFILE_TAB:
              ICON = focused ? ICON_PROFILE_ACTIVE : ICON_PROFILE_INACTIVE;
              break;
            default:
              ICON = ICON_CHAT_ACTIVE;
          }

          return <ICON />;
        },
      })}>
      <Tab.Screen
        name={RouteNames.CHAT_TAB}
        component={ChatTabStack}
        options={{tabBarLabel: TEXT.CHAT}}
      />
      <Tab.Screen
        name={RouteNames.AGENT_TAB}
        component={AgentStack}
        options={{tabBarLabel: TEXT.AGENTS}}
      />
      <Tab.Screen
        name={RouteNames.RESOURCES_TAB}
        component={ResourcesStack}
        options={{tabBarLabel: TEXT.RESOURCES}}
      />
       {/* <Tab.Screen
        name={RouteNames.SUPPORT_CHAT}
        component={SupportChat}
        options={{tabBarLabel: TEXT.SUPPORT_CHAT}}
      /> */}
      <Tab.Screen
        name={RouteNames.PROFILE_TAB}
        component={ProfileView}
        options={{tabBarLabel: TEXT.PROFILE}}
      />
     
    </Tab.Navigator>
  );
};

export default BottomTabBar;
