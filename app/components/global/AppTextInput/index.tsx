import {
  TouchableOpacity,
  View,
  ViewStyle,
  TextInput,
  KeyboardType,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
} from 'react-native';
import React, {FC, useRef} from 'react';
import styles from './styles';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';
import AppLabel from '../AppLabel';
// props of inputs define here
interface GTInputProps {
  label?: string;
  labelFontSize?: number;
  labelFontFamily?: string;
  backgroundColor?: string;
  customStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  onRightIconPress?: () => void;
  leftIcon?: any;
  rightIcon?: any;
  inputStyle?: any;
  placeholder?: string;
  placeholderTextColor?: string;
  focus?: boolean;
  input?: string;
  setInput?: (input: string) => void;
  setfocus?: (focus: boolean) => void;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  isError?: any;
  errorStyle?: ViewStyle;
  autoCapitalize?: string;
  labelColor?: string;
  labelFontWeight?: any;
  inputContainer?: ViewStyle;
  editable?: boolean;
  isSearch?: boolean;
  maxLength?: number;
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  ref?: any;
  testID?: string;
  isOTP?: boolean;
  autoFocus?: boolean;
}

/**
 * GTInput is component to display input with label and it supports nesting and styling.
 * @param {string} label is the title of input value that you wants to display.
 * @param {number} labelFontSize change the size of font.
 * @param {string} labelFontFamily change the size of font family.
 * @param {string} backgroundColor you can change color of text.
 * @param {ViewStyle} customStyle if you want to add custom styling.
 * @param {ViewStyle} labelStyle if you want to add custom styling of label of the input.
 * @param {Function} onRightIconPress onPress handle by this props.
 * @param {any} leftIcon if you want to add custom icon inside button left side.
 * @param {any} rightIcon if you want to add custom icon inside button right side.
 * @param {ViewStyle} inputStyle if you want to add custom styling of TextInput.
 * @param {string} placeholder message that you wants to display in input field.
 * @param {string} placeholderTextColor you can change color of text
 * @param {boolean} focus if you want to add custom styling.
 * @param {string} input if you want to add custom styling of label of the input.
 * @param {void} setInput onPress handle by this props.
 * @param {void} setFocus if you want to add custom icon inside button left side.
 * @param {string} keyboardType if you want to add custom icon inside button right side.
 * @param {boolean} secureTextEntry if you want to add custom styling of TextInput.
 * @param {any} isError message that you wants to display in input field.
 * @param {ViewStyle} errorStyle you can change color of text
 * @param {string} autoCapitalize you can change autoCapitalize value.
 * @returns The styled input
 */

// return the component
const AppTextInput: FC<GTInputProps> = React.forwardRef(
  (
    {
      label,
      labelFontSize = FONT_VARIENTS.custom(14),
      labelFontFamily = FONT_FAMILY.Medium,
      customStyle = {},
      labelStyle = {},
      onRightIconPress,
      leftIcon,
      rightIcon,
      inputStyle,
      placeholder,
      placeholderTextColor = COLORS.GRAY_TEXT_COLOR,
      focus,
      input,
      setInput = () => {},
      setfocus = () => {},
      keyboardType,
      secureTextEntry,
      isError,
      autoCapitalize,
      labelColor = COLORS.SECONDARY_COLOR,
      // labelFontWeight = '600',
      inputContainer,
      editable = true,
      isSearch,
      maxLength,
      onKeyPress,
      testID,
      isOTP,
      autoFocus = false,
    },
    ref,
  ) => {
    const innerRef = useRef<TextInput>(null);
    return (
      <Animated.View
        testID="otp-input"
        layout={LinearTransition.springify().damping(14)}
        style={[
          styles.mainContainer,
          {
            ...customStyle,
          },
        ]}>
        {/* Title */}
        {label && (
          <AppLabel
            text={label}
            fontSize={labelFontSize}
            fontFamily={labelFontFamily}
            color={labelColor}
            // fontWeight={labelFontWeight}
            textStyle={{...styles.textStyle, ...labelStyle}}
          />
        )}

        {/* Input */}
        <View
          style={{
            ...styles.inputContainer,
            ...inputContainer,
          }}>
          {leftIcon && <View style={styles.actionIcon}>{leftIcon}</View>}
          <TextInput
            autoFocus={autoFocus}
            testID={testID}
            //@ts-ignore
            ref={ref}
            placeholder={focus ? '' : placeholder}
            placeholderTextColor={placeholderTextColor}
            value={input}
            textContentType={isOTP ? 'oneTimeCode' : 'none'}
            style={[
              styles.inputStyle,
              inputStyle,
              {
                width: leftIcon
                  ? rightIcon
                    ? '80%'
                    : '90%'
                  : rightIcon
                  ? '90%'
                  : '100%',
              },
            ]}
            onChangeText={em => setInput(em)}
            onFocus={() => {
              setfocus(true);
            }}
            keyboardType={keyboardType}
            onBlur={() => setfocus(false)}
            blurOnSubmit
            secureTextEntry={secureTextEntry}
            // autoCapitalize={autoCapitalize == 'none' ? 'none' : 'words'}
            editable={editable}
            maxLength={maxLength || 10000000000}
            onKeyPress={event => onKeyPress && onKeyPress(event)}
            allowFontScaling={false}
          />
          {rightIcon && (
            <TouchableOpacity
              hitSlop={20}
              onPress={onRightIconPress}
              activeOpacity={0.8}
              style={styles.actionIcon}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {/* Error */}
        {!isSearch && isError ? (
          <Animated.View style={styles.errorView}>
            <AppLabel
              text={isError}
              color={'red'}
              fontSize={FONT_VARIENTS.p}
              fontWeight="400"
              textStyle={{marginLeft: '2%'}}
            />
          </Animated.View>
        ) : (
          !isSearch && (
            <AppLabel
              text={''}
              color={''}
              fontSize={FONT_VARIENTS.p}
              fontWeight="400"
              textStyle={{marginLeft: '2%'}}
            />
          )
        )}
      </Animated.View>
    );
  },
);

export default AppTextInput;
