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
import {
  ICON_EMAIL,
  ICON_GLOBE,
  ICON_HIDE,
  ICON_PASSWORD,
  ICON_SHOW,
} from '@assets/icons';
import {goBack, navigate} from '@navigation-utils';
import {loginValidationSchema, RouteNames, setPrefsValue} from '@utils';
import {useFormik} from 'formik';
import {FormikValues} from './types';
import {STORAGE} from '@constants';
import {useLoginApiMutation} from '../../../redux/auth-api-slice';
import {useAppDispatch} from '../../../redux/reduxHook';
import {setIsLogin, setUserInfo} from '../../../redux/app-slice';
import Toast from 'react-native-toast-message';
import {useNavigationState} from '@react-navigation/native';
import {useText} from '@localization';

const Login: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {TEXT} = useText();
  const dispatch = useAppDispatch();
  const routes = useNavigationState(state => state.routes);
  const currentIndex = useNavigationState(state => state.index);
  const previousRoute = routes[currentIndex - 1]?.name;

  const handleShowHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const [loginApi, {isLoading}] = useLoginApiMutation();

  const handleLogin = async () => {
    try {
      const response: any = await loginApi({
        email: formik.values.emailAddress,
        password: formik.values.password,
      }).unwrap();

      if (response?.success) {
        // 1. Save Tokens and IDs
        setPrefsValue(STORAGE.TOKEN, response?.token);
        setPrefsValue(STORAGE.USER_ID, response?.data?.uuid);

        // 2. SAVE USER DATA (Crucial for notification tap handling)
        setPrefsValue(STORAGE.USER_DATA, JSON.stringify(response?.data));

        // 3. Update Redux
        dispatch(setIsLogin(true));
        dispatch(setUserInfo(response?.data));

        // Note: RootNavigation will handle generating the NEW FCM token
        // as soon as isLogin turns to true.

        Toast.show({type: 'success', text1: TEXT.LOGIN_SUCCESS});
      } else {
        Alert.alert('Error', response?.error);
      }
    } catch (error: any) {
      const errMsg = error?.data?.error || 'Login failed';
      Alert.alert('Error', errMsg);
    }
  };

  const formik = useFormik<FormikValues>({
    initialValues: {emailAddress: '', password: ''},
    validationSchema: loginValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleLogin,
  });

  return (
    <AppView customViewStyle={{gap: SPACING.custom(28), marginTop: SPACING.l}}>
      <View style={{gap: SPACING.xxxs}}>
        <AppLabel
          text="Sign In"
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
        <TouchableOpacity
          style={{position: 'absolute', right: 0, top: SPACING.xs}}
          onPress={() => navigate(RouteNames.LANGUAGE_STACK)}>
          <ICON_GLOBE />
        </TouchableOpacity>
      </View>

      <View>
        <AppTextInput
          placeholder={TEXT.ENTER_YOUR_EMAIL}
          leftIcon={<ICON_EMAIL />}
          input={formik.values.emailAddress}
          setInput={formik.handleChange('emailAddress')}
          isError={formik?.errors?.emailAddress}
        />
        <AppTextInput
          placeholder={TEXT.ENTER_YOUR_PASSWORD}
          leftIcon={<ICON_PASSWORD />}
          rightIcon={!showPassword ? <ICON_SHOW /> : <ICON_HIDE />}
          secureTextEntry={!showPassword}
          keyboardType={'default'}
          input={formik.values.password}
          setInput={formik.handleChange('password')}
          isError={formik?.errors?.password}
          onRightIconPress={handleShowHidePassword}
        />
        <AppLabel
          text={TEXT.FORGOT_YOUR_PASSWORD}
          fontFamily={FONT_FAMILY.Medium}
          textAlign="right"
          color={COLORS.SECONDARY_COLOR}
          onPress={() => navigate(RouteNames.FORGOT_PASSWORD)}
        />
      </View>

      <AppButton
        text={TEXT.LOGIN}
        onHandlePress={formik?.handleSubmit}
        isLoading={isLoading}
      />

      <KeyboardAvoidingView
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <AppLabel
          fontFamily={FONT_FAMILY.Medium}
          textStyle={{paddingBottom: SPACING.l}}
          text={
            <>
              {TEXT.DONT_HAVE_ACCOUNT}
              <Text
                onPress={() => {
                  previousRoute === RouteNames.SIGN_UP
                    ? goBack()
                    : navigate(RouteNames.SIGN_UP);
                }}
                style={{
                  fontFamily: FONT_FAMILY.Medium,
                  color: COLORS.SECONDARY_COLOR,
                }}>
                {' ' + TEXT.SIGN_UP}
              </Text>
            </>
          }
        />
      </KeyboardAvoidingView>
    </AppView>
  );
};

export default Login;
