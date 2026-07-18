import {Pressable, Text, TextInput, View} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {AppLabel, AppTextInput} from '@components';
import styles from './styles';
import {OTPFormProps} from './types';
import ResendOTPTimer from '../ResendOTPTimer';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {
  COLORS,
  FONT_FAMILY,
  FONT_VARIENTS,
  scaleSize,
  screenWidth,
} from '@theme';

const OTPForm: FC<OTPFormProps> = ({
  otpInput,
  setOtpInput,
  otpError,
  onOtpSend,
  otpSendLoading,
  mobileNumber,
  testID,
}) => {
  const [otp, setOtp] = useState('');

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // State for the focused input
  // const newotp = otp.join('');

  // set the otp in the formik field value
  useEffect(() => {
    // formik.setFieldValue('otp', otp);
    // formik.setErrors({});
    setOtpInput(otp);
  }, [otp]);
  const handleInputChange = (index: number, value: string) => {
    // Update the OTP array when a digit is entered
    const newOtp = [...otp];
    newOtp[index] = value;
    // setOtp(newOtp);

    // Move to the next input field if a digit is entered
    if (index < 5 && value !== '') {
      refs[index + 1]?.focus();
    }
  };

  var inputRef = useRef<TextInput>(null);
  const refs: any[] = [];
  for (let i = 0; i < 5; i++) {
    refs[i] = React.createRef<any>();
  }
  const _layout = LinearTransition.springify().damping(14);
  // handle the backspace input by user, change the focus in between different text fields
  const handleBackspace = (index: number) => {
    if (index > 0) {
      refs[index - 1].focus();
      refs[index].clear();
      const newOtp = [...otp];
      newOtp[index] = '';
      // setOtp(newOtp);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {/* {otp.map((digit, index) => (
          <AppTextInput
            testID={(testID || '') + index}
            key={index}
            ref={(input: TextInput) => (refs[index] = input)}
            keyboardType={'numeric'}
            inputContainer={{
              width: scaleSize(50),
              height: scaleSize(50),
              borderColor:
                index === focusedIndex
                  ? COLORS.SECONDARY_COLOR
                  : COLORS.LIGHT_BORDER_COLOR,
              borderWidth: 2,
              borderRadius: scaleSize(12),
              backgroundColor:
                index === focusedIndex
                  ? COLORS.APP_BACKGROUND
                  : COLORS.LIGHT_BORDER_COLOR,
              paddingHorizontal: 0,
            }}
            inputStyle={{
              textAlign: 'center',
              fontSize: FONT_VARIENTS.h4,
              color:
                index === focusedIndex
                  ? COLORS.SECONDARY_COLOR
                  : COLORS.SECONDARY_COLOR,
            }}
            customStyle={{
              width: screenWidth * 0.135,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            placeholder="-"
            setfocus={i => {
              setFocusedIndex(index);
            }}
            focus={index === focusedIndex}
            maxLength={1}
            input={digit}
            labelFontFamily={FONT_FAMILY.Regular}
            setInput={value => handleInputChange(index, value)}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              } else if (index < 5) {
                refs[index + 1].focus();
                const newOtp = [...otp];
                newOtp[index] = nativeEvent?.key;
                setOtp(newOtp);
              } else {
                const newOtp = [...otp];
                newOtp[index] = nativeEvent?.key;
                setOtp(newOtp);
              }
            }}

            // isError={formik.errors.otp && formik.errors.otp}
          />
        ))} */}

        {/* Z-Stack Wrapper */}
        <Pressable
          style={styles.otpWrapper}
          onPress={() => inputRef.current?.focus()}>
          {/* Invisible single TextInput */}
          <AppTextInput
            testID={testID || ''}
            ref={inputRef}
            // keyboardType={'numeric'}
            keyboardType="number-pad"
            customStyle={{
              padding: 0,
            }}
            setInput={v => setOtp(v)}
            isOTP={true}
            inputContainer={{
              borderColor: 'transparent',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              opacity: 0,
              right: 0,
              // zIndex: 99,
            }}
            placeholder=""
            labelFontFamily={FONT_FAMILY.Regular}
            maxLength={6}

            // isError={formik.errors.otp && formik.errors.otp}
          />

          {/* Visual OTP boxes */}
          <View style={styles.boxContainer}>
            {Array.from({length: 6}).map((_, index) => {
              const digit = otp[index] || '';
              const isFocused = otp.length === index;

              return (
                <View
                  key={index}
                  style={[styles.box, isFocused && styles.focusedBox]}>
                  <Text style={styles.boxText}>{digit}</Text>
                </View>
              );
            })}
          </View>
        </Pressable>
      </View>

      {otpError && (
        <AppLabel
          text={otpError}
          color={COLORS.ERROR}
          fontSize={FONT_VARIENTS.p}
        />
      )}
      <Animated.View layout={_layout}>
        <ResendOTPTimer onResendPress={onOtpSend} isPending={otpSendLoading} />
      </Animated.View>
    </View>
  );
};

export default OTPForm;
