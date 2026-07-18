import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize} from '@theme';
import AppLabel from '../AppLabel';
import {APPButtonProps} from './types';

/**
 * AppButton is component to display button and it supports nesting and styling.
 * @param {string} text message that you wants to display
 * @param {number} fontSize change the size of font.
 * @param {string} fontFamily change the size of font family.
 * @param {string} backgroundColor you can change color of text.
 * @param {string} color you can change color of text.
 * @param {ViewStyle} customStyle if you want to add custom styling.
 * @param {Function} onHandlePress onPress handle by this props.
 * @param {any} leftIcon if you want to add custom icon inside button left side.
 * @param {any} rightIcon if you want to add custom icon inside button right side.
 * @param {boolean} disabled disabled button of this props.
 * @returns The styled button
 */

// return the component
const AppButton: FC<APPButtonProps> = ({
  text,
  backgroundColor = COLORS.SECONDARY_COLOR,
  fontSize = FONT_VARIENTS.h4,
  fontFamily = FONT_FAMILY.Bold,
  color = COLORS.APP_BACKGROUND,
  customStyle = {},
  onHandlePress,
  leftIcon,
  rightIcon,
  disabled = false,
  leftStyle,
  rightStyle,
  fontWeight,
  isLoading,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled}
      onPress={onHandlePress}
      activeOpacity={0.8}
      style={[
        styles.mainContainer,
        {
          backgroundColor,
          ...customStyle,
        },
      ]}>
      {leftIcon && (
        <View
          style={{
            height: scaleSize(24),
            width: scaleSize(24),
            ...leftStyle,
          }}>
          {leftIcon}
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator
          testID="activity-indicator"
          size={'small'}
          color={COLORS.APP_BACKGROUND}
        />
      ) : (
        <AppLabel
          text={text}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textStyle={styles.textStyle}
          fontWeight={fontWeight}
          color={color}
        />
      )}
      {rightIcon && (
        <View
          style={{
            height: scaleSize(24),
            width: scaleSize(24),
            ...rightStyle,
          }}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
