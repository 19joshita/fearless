import React, {FC, useState} from 'react';
import {Text} from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {ChatAnimatingTextProps} from './types';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';

const ChatAnimatingText: FC<ChatAnimatingTextProps> = ({
  text,
  durationPerChar = 10,
  textStyle = {},
  onTypingComplete,
}) => {
  const [visibleText, setVisibleText] = useState('');
  const progress = useSharedValue(0);

  const updateVisibleText = (count: number) => {
    setVisibleText(text.slice(0, count));
  };

  useDerivedValue(() => {
    runOnJS(updateVisibleText)(Math.floor(progress.value));
  }, [progress]);

  React.useEffect(() => {
    progress.value = withTiming(
      text.length,
      {
        duration: text.length * durationPerChar,
      },
      isFinished => {
        if (isFinished) {
          onTypingComplete && runOnJS(onTypingComplete)();
        }
      },
    );
  }, [text]);

  return (
    <Text
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      style={{
        fontSize: FONT_VARIENTS.custom(14),
        color: COLORS.TEXT_COLOR,
        fontFamily: FONT_FAMILY.Regular,
        paddingVertical: 0,
        includeFontPadding: false,
      }}>
      {visibleText}
    </Text>
  );
};

export default ChatAnimatingText;
