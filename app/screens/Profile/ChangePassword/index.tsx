import {View} from 'react-native';
import React, {FC, useState} from 'react';
import {
  AppButton,
  AppConfirmationModal,
  AppHeader,
  AppTextInput,
  AppView,
} from '@global-components';
import {STORAGE} from '@constants';
import {ICON_HIDE, ICON_PASSWORD, ICON_SHOW, ICON_SUCCESS} from '@assets/icons';
import {ChangePasswordValues} from './types';
import {useFormik} from 'formik';
import {changePasswordValidationSchema, setPrefsValue} from '@utils';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {SPACING} from '@theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useChangePasswordMutation} from '@redux/auth-api-slice';
import Toast from 'react-native-toast-message';
import {setIsLogin} from '@redux/app-slice';
import {useAppDispatch} from '@redux/reduxHook';
import {useText} from '@localization';

const ChangePassword: FC = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] =
    useState<boolean>(false);
  const [triggerChangePassword, {isLoading}] = useChangePasswordMutation();
  const [isChange, setIsChange] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {TEXT} = useText();

  const handleShowHidePassword = (
    type: 'password' | 'confirmPassword' | 'currentPassword',
  ) => {
    if (type === 'password') {
      setPasswordVisible(prev => !prev);
    } else if (type === 'confirmPassword') {
      setConfirmPasswordVisible(prev => !prev);
    } else if (type === 'currentPassword') {
      setCurrentPasswordVisible(prev => !prev);
    }
  };

  const callChangePassword = async () => {
    try {
      const params = {
        old_password: formik.values.currentPassword,
        new_password: formik.values.newPassword,
        confirm_password: formik.values.confirmPassword,
      };
      const response = await triggerChangePassword(params).unwrap();
      if (response?.success) {
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        setIsChange(true);
      }
    } catch (error) {
      console.error('change password error ', error);
    }
  };

  const formik = useFormik<ChangePasswordValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
      currentPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: callChangePassword,
  });

  return (
    <AppView customViewStyle={{gap: SPACING.l}}>
      <AppHeader title={TEXT.CHANGE_PASSWORD} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        keyboardDismissMode="interactive"
        bounces={false}
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <Animated.View layout={LinearTransition.springify().damping(14)}>
          <AppTextInput
            placeholder={TEXT.CURRENT_PASSWORD}
            leftIcon={<ICON_PASSWORD />}
            rightIcon={!currentPasswordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
            input={formik.values.currentPassword}
            setInput={formik.handleChange('currentPassword')}
            onRightIconPress={() => handleShowHidePassword('currentPassword')}
            isError={formik.errors?.currentPassword}
            secureTextEntry={!currentPasswordVisible}
          />
          <AppTextInput
            placeholder={TEXT.NEW_PASSWORD}
            leftIcon={<ICON_PASSWORD />}
            rightIcon={!passwordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
            input={formik.values.newPassword}
            setInput={formik.handleChange('newPassword')}
            onRightIconPress={() => handleShowHidePassword('password')}
            isError={formik.errors?.newPassword}
            secureTextEntry={!passwordVisible}
          />
          <AppTextInput
            placeholder={TEXT.CONFIRM_PASSWORD}
            leftIcon={<ICON_PASSWORD />}
            rightIcon={!confirmPasswordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
            input={formik.values.confirmPassword}
            setInput={formik.handleChange('confirmPassword')}
            onRightIconPress={() => handleShowHidePassword('confirmPassword')}
            isError={formik.errors?.confirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
        </Animated.View>

        <AppButton
          isLoading={isLoading}
          text={TEXT.CHANGE_PASSWORD}
          onHandlePress={formik.handleSubmit}
        />
      </KeyboardAwareScrollView>

      <AppConfirmationModal
        visible={isChange}
        actionPerformed={TEXT.PASSWORD_CHANGED}
        confirmationText={TEXT.PASSWORD_CHANGED_SUCCESS}
        icon={
          <View style={{paddingVertical: SPACING.m}}>
            <ICON_SUCCESS />
          </View>
        }
        isIcon={true}
        rightButton={true}
        rightButtonLoading={isLoading}
        rightButtonText={TEXT.BACK_TO_LOGIN}
        onPressRightButton={() => {
          setPrefsValue(STORAGE.TOKEN, '');
          setPrefsValue(STORAGE.USER_ID, '');
          dispatch(setIsLogin(false));
        }}
      />
    </AppView>
  );
};

export default ChangePassword;
