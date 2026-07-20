import {
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ICON_GLOBE,
  IMAGE_LOGO,
  IMAGE_LOGO_TEXT,
  SPLASH_VIDEO,
} from '@assets/icons';
import styles from './styles';
import { STORAGE } from '@constants';
import { AppButton, AppLabel } from '@components';
import { COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING } from '@theme';
import { navigate } from '@navigation-utils';
import { getPrefsValue, RouteNames, setPrefsValue, useText } from '@utils';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Video from 'react-native-video';
import { setIsLogin } from '../../../redux/app-slice';
import { useAppDispatch } from '../../../redux/reduxHook';

const Splash: FC = () => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(scaleSize(450));
  const dispatch = useAppDispatch();
  const { TEXT } = useText();

  useFocusEffect(
    React.useCallback(() => {
      Platform.OS === 'android' && StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');

      return () => {
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('dark-content');
      };
    }, []),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  const handleVideoEnd = () => {
    // const toke
  };

  useEffect(() => {
    const token = getPrefsValue(STORAGE.TOKEN);
    setTimeout(() => {
      if (token) {
        dispatch(setIsLogin(true));
      } else {
        translateY.value = withTiming(0);
      }
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      {/* <Image style={styles.imageStyle} source={IMAGE_SPLASH} /> */}
      <View style={styles.container}>
        <Video
          source={SPLASH_VIDEO}
          style={styles.imageStyle}
          resizeMode="cover"
          onEnd={handleVideoEnd}
          repeat={true}
          paused={false}
        />
      </View>
      <Animated.View
        style={[
          styles.authConatiner,
          { bottom: insets.bottom + SPACING.custom(24) },
          animatedStyle,
        ]}>
        <AppLabel
          //@ts-ignore
          text={
            <>
              {TEXT.WELCOME_MESSAGE}
              <Text style={{ fontFamily: FONT_FAMILY.Medium }}>
                {TEXT.WELCOME_MESSAGE_LIGHT}
              </Text>
            </>
          }
          fontSize={FONT_VARIENTS.h1}
          color={COLORS.WHITE_COLOR}
          fontFamily={FONT_FAMILY.Bold}
        />

        <AppButton
          text={TEXT.GET_STARTED}
          onHandlePress={() => navigate(RouteNames.SIGN_UP)}
        />
        <AppButton
          backgroundColor={COLORS.WHITE_BUTTON_COLOR}
          text={TEXT.LOG_IN}
          color={COLORS.SECONDARY_COLOR}
          onHandlePress={() => navigate(RouteNames.LOGIN)}
        />
      </Animated.View>
      <View style={styles.logoContainer}>
        <Image source={IMAGE_LOGO_TEXT} />
      </View>
      <TouchableOpacity
        style={{ right: '5%', ...styles.logoContainer }}
        onPress={() => navigate(RouteNames.LANGUAGE_STACK)}>
        <ICON_GLOBE />
      </TouchableOpacity>
    </View>
  );
};

export default Splash;
