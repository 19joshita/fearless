import {Text} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';
import {AppLabelProps} from './types';

const AppLabel: FC<AppLabelProps> = ({
  text,
  fontSize = FONT_VARIENTS.h6,
  fontFamily = FONT_FAMILY.Regular,
  fontWeight,
  color = COLORS.TEXT_COLOR,
  textAlign = 'left',
  textStyle = {},
  numberOfLines,
  lineBreakMode = 'tail',
  onPress,
  testID,
}) => {
  return (
    <Text
      testID={testID}
      onPress={onPress}
      numberOfLines={numberOfLines}
      lineBreakMode={lineBreakMode}
      allowFontScaling={false}
      //   @ts-ignore
      style={{
        ...styles.label,
        fontFamily,
        color,
        fontSize,
        textAlign,
        ...textStyle,
      }}>
      {text}
    </Text>
  );
};

export default AppLabel;
