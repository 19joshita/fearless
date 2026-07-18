import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {FC, useState} from 'react';
import {AppButton, AppLabel, AppTextInput, AppView} from '@components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {ICON_BACK, ICON_HIDE, ICON_PASSWORD, ICON_SHOW} from '@assets/icons';
import {goBack, navigate, replace, resetAndNavigate} from '@navigation-utils';
import {resetValidationSchema, RouteNames} from '@utils';
import {usePasswordResetMutation} from '../../../redux/auth-api-slice';
import {useRoute} from '@react-navigation/native';
import {ResetFormikValues, ResetPasswordRouteProp} from './types';
import Toast from 'react-native-toast-message';
import {useFormik} from 'formik';
import {useText} from '@localization';

const ResetPassword: FC = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const {token} = route.params;
  const {TEXT} = useText();
  console.log('token ', token);
  const [resetPassword, {isLoading}] = usePasswordResetMutation();
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const handleReset = async () => {
    const params: ResetPasswordParams = {
      token: token,
      new_password: formik.values.newPassword,
      confirm_password: formik.values.confirmPassword,
    };
    try {
      setLoading(true);
      const response = await resetPassword(params).unwrap();
      if (response?.success) {
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        resetAndNavigate(RouteNames.LOGIN);
      }
    } catch (error) {
      console.error('Reset Password Error ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHidePassword = (type: 'password' | 'confirmPassword') => {
    type === 'password'
      ? setPasswordVisible(prev => !prev)
      : setConfirmPasswordVisible(prev => !prev);
  };

  const formik = useFormik<ResetFormikValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleReset,
  });

  return (
    <AppView customViewStyle={{gap: SPACING.custom(28), marginTop: SPACING.l}}>
      <TouchableOpacity onPress={() => goBack()}>
        <ICON_BACK />
      </TouchableOpacity>
      <View style={{gap: SPACING.xxxs}}>
        <AppLabel
          text={TEXT.RESET_PASSWORD_TITLE}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(28)}
          fontFamily={FONT_FAMILY.Bold}
        />

        <AppLabel
          text={TEXT.RESET_PASSWORD_INSTRUCTION}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(16)}
          fontFamily={FONT_FAMILY.Regular}
        />
      </View>

      <View>
        <AppTextInput
          placeholder={TEXT.ENTER_YOUR_PASSWORD}
          leftIcon={<ICON_PASSWORD />}
          rightIcon={!passwordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
          input={formik.values.newPassword}
          setInput={formik.handleChange('newPassword')}
          onRightIconPress={() => handleShowHidePassword('password')}
          secureTextEntry={!passwordVisible}
          isError={formik?.errors?.newPassword}
        />
        <AppTextInput
          placeholder={TEXT.REENTER_PASSWORD}
          leftIcon={<ICON_PASSWORD />}
          rightIcon={!confirmPasswordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
          input={formik.values.confirmPassword}
          setInput={formik.handleChange('confirmPassword')}
          onRightIconPress={() => handleShowHidePassword('confirmPassword')}
          secureTextEntry={!confirmPasswordVisible}
          isError={formik?.errors?.confirmPassword}
        />
      </View>
      <AppButton
        text={TEXT.RESET_PASSWORD_BUTTON}
        isLoading={loading || isLoading}
        onHandlePress={formik.handleSubmit}
      />
    </AppView>
  );
};

export default ResetPassword;
