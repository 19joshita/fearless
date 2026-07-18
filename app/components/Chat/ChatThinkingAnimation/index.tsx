import {useText} from '@localization';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';
import React, {useEffect} from 'react';
import {Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const ChatThinkingAnimation = () => {
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

  return (
    <Animated.Text
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      style={[
        {
          fontSize: FONT_VARIENTS.custom(15),
          fontFamily: FONT_FAMILY.Medium,
          color: COLORS.TEXT_COLOR,
        },
        animatedStyle,
      ]}>
      {`✨${TEXT.ANALYZING}...`}
    </Animated.Text>
  );
};

export default ChatThinkingAnimation;
