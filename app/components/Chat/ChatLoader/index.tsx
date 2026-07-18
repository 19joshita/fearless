import React, {FC, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {ChatLoaderProps} from './types';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';
import styles from './styles';
import {useText} from '@localization';

const LoadingOverlay: FC<ChatLoaderProps> = ({
  loadingText,
  isLoadingComponent = false,
}) => {
  const opacity = useSharedValue(0);
  const {TEXT} = useText();

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 1000}), // fade in
        withTiming(0, {duration: 1000}), // fade out
      ),
      -1, // repeat forever
      true, // reverse each time
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // const animatedProps = useAnimatedProps(() => ({
  //   allowFontScaling: false,
  //   maxFontSizeMultiplier: 1,
  // }));

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={StyleSheet.absoluteFill}
      pointerEvents="auto">
      {/* <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      /> */}

      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(255,255,255,0.92)'},
          ]}
        />
      )}

      <View style={styles.centerContainer}>
        {/* <ActivityIndicator size="large" color="#000" /> */}
        {!isLoadingComponent ? (
          <Animated.Text
            // animatedProps={animatedProps}
            allowFontScaling={false}
            maxFontSizeMultiplier={1}
            style={[
              {
                fontSize: FONT_VARIENTS.custom(60),
                fontFamily: FONT_FAMILY.Regular,
                color: COLORS.BODY_TEXT_COLOR,
              },
              animatedStyle,
            ]}>
            ✨
          </Animated.Text>
        ) : (
          <View>
            <ActivityIndicator size={'large'} color={COLORS.SECONDARY_COLOR} />
          </View>
        )}

        <Animated.Text
          allowFontScaling={false}
          maxFontSizeMultiplier={1}
          style={[
            {
              fontSize: FONT_VARIENTS.h4,
              fontFamily: FONT_FAMILY.Semibold,
              color: COLORS.BODY_TEXT_COLOR,
            },
            animatedStyle,
          ]}>
          {loadingText || TEXT.LOADING}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

export default LoadingOverlay;
