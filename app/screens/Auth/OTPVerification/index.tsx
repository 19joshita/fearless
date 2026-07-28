import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React, {FC, useState} from 'react';
import {AppButton, AppLabel, AppView, OTPForm} from '@components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {ICON_BACK} from '@assets/icons';
import {
  AuthRootStackParamList,
  goBack,
  navigate,
  resetAndNavigate,
} from '@navigation-utils';
import {otpValidationSchema, RouteNames, setPrefsValue} from '@utils';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  useForgotOtpVerifyMutation,
  useOtpVerifyMutation,
  usePasswordForgotMutation,
  useResendOtpMutation,
} from '../../../redux/auth-api-slice';
import {useFormik} from 'formik';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setIsLogin, setUserInfo} from '../../../redux/app-slice';
import {STORAGE} from '@constants';
import {useText} from '@localization';

type OTPRouteProp = RouteProp<
  AuthRootStackParamList,
  typeof RouteNames.OTP_VERIFICATION
>;
const OTPVerification: FC = () => {
  const route = useRoute<OTPRouteProp>();
  const {type, token, email} = route?.params;
  const {TEXT} = useText();
  const [otpVerify, {isLoading: verifying}] = useOtpVerifyMutation();
  const [resendOtp, {isLoading: resending}] = useResendOtpMutation();
  const [forgotPassword, {isLoading: forgotLoading}] =
    usePasswordForgotMutation();
  const [resendToken, setResendToken] = useState<string>(token);
  const dispatch = useDispatch();
  const handleVerifyOTP = async () => {
    if (type === 'forgotPassword') {
      handleForgotOtpVerify({
        token: resendToken,
        otp: formik?.values?.otp,
      });
      return;
    }
    try {
      const response = await otpVerify({
        token: token,
        otp: formik.values.otp,
      }).unwrap();
      if (response?.success) {
        // Alert.alert('OTP verified');
        // resetAndNavigate(RouteNames.HOME);
        Toast.show({
          text1: TEXT.SIGNUP_SUCCESS,
          type: 'success',
        });
        dispatch(setUserInfo(response?.data));
        setPrefsValue(STORAGE.TOKEN, response?.token);
        setPrefsValue(STORAGE.USER_ID, response?.data?.uuid);
        setTimeout(() => {
          dispatch(setIsLogin(true));
        }, 400);
      }
    } catch (err: any) {
      // Error logic
      console.error(
        'varify error ',
        err?.data?.error || 'Failed to verify OTP',
      );
      // formik.resetForm();
      Alert.alert(
        'OTP Error',
        err?.data?.error || err?.error || 'Failed to verify OTP',
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        text1: 'Email field is required',
        type: 'error',
      });
    }
    try {
      const response = await forgotPassword({
        email: email || '',
      }).unwrap();

      if (response?.success) {
        const token = response?.token;
        setResendToken(token);
        Toast.show({
          text1: TEXT.SIGNUP_SUCCESS,
          type: 'success',
        });
        // Optionally, store or use the returned token
        console.log('Token:', response.token);
        return true;
      } else {
        Alert.alert('Error', response?.error);
      }
      return false;
    } catch (error: any) {
      const errMsg = error?.data?.error || 'Something went wrong';
      Alert.alert('Error', errMsg);
      return false;
    }
  };

  const handleResendOTP = async () => {
    if (type === 'forgotPassword') {
      const success = handleForgotPassword();
      return success;
    }
    try {
      const response = await resendOtp({
        token: token,
      }).unwrap();
      if (response?.success && response?.token) {
        setResendToken(response?.token);
        // Alert.alert('Otp Resent', 'Otp send successfully on your email.');
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      // Error logic
      console.error(
        'resend error ',
        err?.data?.error || 'Failed to resend OTP',
        resendToken,
      );
      return false;
      // Alert.alert('Resend Error ', err?.data?.error || 'Failed to resend OTP');
    }
  };

  const [forgotOtpVerify, {isLoading}] = useForgotOtpVerifyMutation();

  const handleForgotOtpVerify = async (params: ForgotResetPasswordParams) => {
    try {
      const response: any = await forgotOtpVerify(params).unwrap();
      if (response.success) {
        const resp = response.token;
        navigate(RouteNames.RESET_PASSWORD, {
          token: resp || resendToken,
        });
        Toast.show({
          text1: TEXT.SIGNUP_SUCCESS,
          type: 'success',
        });
      } else {
        // Alert.alert('Error', response?.error);
      }
    } catch (error: any) {
      const errMsg = error?.data?.error || 'Verification failed';
      // Alert.alert('Error', errMsg);
    }
  };

  const formik = useFormik<OTPValues>({
    initialValues: {
      otp: '',
    },
    validationSchema: otpValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleVerifyOTP,
  });

  const handleOtpChnage = (val: string) => {
    formik.setFieldValue('otp', val);
  };

  return (
    <AppView customViewStyle={{gap: SPACING.custom(28), marginTop: SPACING.l}}>
      <TouchableOpacity onPress={() => goBack()}>
        <ICON_BACK />
      </TouchableOpacity>
      <View style={{gap: SPACING.xxxs}}>
        <AppLabel
          text={TEXT.ENTER_VERIFICATION_CODE}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(28)}
          fontFamily={FONT_FAMILY.Bold}
        />

        <AppLabel
          text={TEXT.VERIFICATION_INSTRUCTIONS}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(16)}
          fontFamily={FONT_FAMILY.Regular}
        />
      </View>

      <View>
        <OTPForm
          otpInput={formik.values.otp}
          setOtpInput={handleOtpChnage}
          otpError={formik.errors?.otp}
          onOtpSend={handleResendOTP}
          otpSendLoading={forgotLoading || resending}
        />
      </View>
      <AppButton
        text={TEXT.VERIFY}
        onHandlePress={formik.handleSubmit}
        isLoading={resending || verifying}
      />

      <View
        style={{
          // backgroundColor: 'red',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        {/* <AppLabel
          fontFamily={FONT_FAMILY.Medium}
          textStyle={{paddingBottom: 40}}
          //@ts-ignore
          text={
            <>
              {TEXT.DIDNT_RECEIVE_CODE}
              <Text
                onPress={handleResendOTP}
                style={{
                  fontFamily: FONT_FAMILY.Medium,
                  color: COLORS.SECONDARY_COLOR,
                }}>
                {' ' + TEXT.RESEND}
              </Text>
            </>
          }
        /> */}
      </View>
    </AppView>
  );
};

export default OTPVerification;
