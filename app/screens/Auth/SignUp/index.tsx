import {
  View,
  Text,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {FC, useState} from 'react';
import {
  AppButton,
  AppCheckbox,
  AppLabel,
  AppTextInput,
  AppView,
} from '@components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {
  ICON_EMAIL,
  ICON_GLOBE,
  ICON_HIDE,
  ICON_NAME,
  ICON_PASSWORD,
  ICON_SHOW,
} from '@assets/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFormik} from 'formik';
import {RouteNames, signupValidationSchema} from '@utils';
import {useRegisterMutation} from '../../../redux/auth-api-slice';
import {goBack, navigate, replace} from '@navigation-utils';
import Toast from 'react-native-toast-message';
import {useNavigationState} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useText} from '@localization';

const SignUp: FC = () => {
  const {bottom} = useSafeAreaInsets();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const {TEXT} = useText();
  const [register, {isLoading, error, data}] = useRegisterMutation();

  const routes = useNavigationState(state => state.routes);
  const currentIndex = useNavigationState(state => state.index);
  const previousRoute = routes[currentIndex - 1]?.name;

  const handleShowHidePassword = (type: 'password' | 'confirmPassword') => {
    type === 'password'
      ? setPasswordVisible(prev => !prev)
      : setConfirmPasswordVisible(prev => !prev);
  };

  const handleRegister = async () => {
    const response = await register({
      name: formik.values.userName,
      email: formik.values.emailAddress,
      password: formik.values.password,
    }).unwrap();

    if (response?.success) {
      navigate(RouteNames.OTP_VERIFICATION, {
        token: response?.token,
        type: 'register',
      });
      Toast.show({
        text1: response?.message,
        type: 'success',
      });
    } else {
      // Toast.show({
      //   text1: response?.error,
      //   type: 'error',
      // });
      Alert.alert('Error', response?.error);
    }
  };

  const formik = useFormik<SignUpValues>({
    initialValues: {
      userName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      agreed: false,
    },
    validationSchema: signupValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleRegister,
  });
  // console.log(translate('MIN_AGE_ERROR'));
  return (
    <AppView customViewStyle={{gap: SPACING.custom(28), marginTop: SPACING.l}}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        bottomOffset={30}
        keyboardDismissMode="interactive"
        bounces={false}
        style={{flex: 1}}
        contentContainerStyle={{gap: SPACING.custom(28)}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: SPACING.custom(8),
          }}>
          <View style={{gap: SPACING.xxxs, flexShrink: 1}}>
            <AppLabel
              text={TEXT.LETS_CREATE_ACCOUNT}
              color={COLORS.TEXT_COLOR}
              fontSize={FONT_VARIENTS.custom(28)}
              fontFamily={FONT_FAMILY.Bold}
            />

            <AppLabel
              text={TEXT.ENTER_REQUIRED_FIELDS}
              color={COLORS.TEXT_COLOR}
              fontSize={FONT_VARIENTS.custom(16)}
              fontFamily={FONT_FAMILY.Regular}
            />
          </View>
          <TouchableOpacity
            style={{marginTop: SPACING.xs}}
            onPress={() => navigate(RouteNames.LANGUAGE_STACK)}>
            <ICON_GLOBE />
          </TouchableOpacity>
        </View>

        <View>
          <AppTextInput
            placeholder={TEXT.ENTER_YOUR_NAME}
            leftIcon={<ICON_NAME />}
            input={formik.values.userName}
            setInput={formik.handleChange('userName')}
            isError={formik?.errors?.userName}
          />

          <AppTextInput
            placeholder={TEXT.ENTER_YOUR_EMAIL}
            leftIcon={<ICON_EMAIL />}
            autoComplete="email"
            input={formik.values.emailAddress}
            setInput={formik.handleChange('emailAddress')}
            isError={formik?.errors?.emailAddress}
          />
          <AppTextInput
            placeholder={TEXT.ENTER_YOUR_PASSWORD}
            leftIcon={<ICON_PASSWORD />}
            rightIcon={passwordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
            input={formik.values.password}
            setInput={formik.handleChange('password')}
            isError={formik?.errors?.password}
            secureTextEntry={!passwordVisible}
            onRightIconPress={() => handleShowHidePassword('password')}
          />
          <AppTextInput
            placeholder={TEXT.ENTER_YOUR_CONFIRM_PASSWORD}
            leftIcon={<ICON_PASSWORD />}
            rightIcon={confirmPasswordVisible ? <ICON_SHOW /> : <ICON_HIDE />}
            input={formik.values.confirmPassword}
            setInput={formik.handleChange('confirmPassword')}
            isError={formik?.errors?.confirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            onRightIconPress={() => handleShowHidePassword('confirmPassword')}
          />
          {/* <AppLabel
          text="Forgot your password?"
          fontFamily={FONT_FAMILY.Medium}
          textAlign="right"
          color={COLORS.SECONDARY_COLOR}
        /> */}
          <AppCheckbox
            title={(() => {
              const prefix = TEXT.TERMS_PREFIX ?? '';
              const linkText =
                TEXT.TERMS_LINK_TEXT ?? TEXT.TERMS_CONDITIONS ?? '';
              const url = TEXT.TERMS_URL;
              return (
                <>
                  {prefix}
                  <Text
                    onPress={(e: any) => {
                      e?.stopPropagation?.();
                      Linking.openURL(url);
                    }}
                    style={{
                      fontFamily: FONT_FAMILY.Medium,
                      color: COLORS.SECONDARY_COLOR,
                    }}>
                    {linkText}
                  </Text>
                </>
              );
            })()}
            onChange={checked => formik.setFieldValue('agreed', checked)}
            checked={formik.values.agreed}
            error={formik?.errors?.agreed}
          />
        </View>
        <AppButton
          text={TEXT.SIGN_UP}
          onHandlePress={formik.handleSubmit}
          isLoading={isLoading}
        />

        <KeyboardAvoidingView
          style={{
            // backgroundColor: 'red',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <AppLabel
            fontFamily={FONT_FAMILY.Medium}
            textStyle={{paddingBottom: bottom + SPACING.l}}
            text={
              <>
                {TEXT.ALREADY_HAVE_AN_ACCOUNT}
                <Text
                  onPress={() => {
                    previousRoute === RouteNames.LOGIN
                      ? goBack()
                      : navigate(RouteNames.LOGIN);
                  }}
                  style={{
                    fontFamily: FONT_FAMILY.Medium,
                    color: COLORS.SECONDARY_COLOR,
                  }}>
                  {'  ' + TEXT.LOG_IN}
                </Text>
              </>
            }
          />
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </AppView>
  );
};

export default SignUp;
