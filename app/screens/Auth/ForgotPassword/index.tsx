import {View, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {AppButton, AppLabel, AppTextInput, AppView} from '@components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {ICON_BACK, ICON_EMAIL} from '@assets/icons';
import {goBack, navigate} from '@navigation-utils';
import {forgotValidationSchema, RouteNames} from '@utils';
import {usePasswordForgotMutation} from '../../../redux/auth-api-slice';
import Toast from 'react-native-toast-message';
import {useFormik} from 'formik';
import {ForgotPasswordFormikValues} from './types';
import {useText} from '@localization';

const ForgotPassword: FC = () => {
  const [forgotPassword, {isLoading}] = usePasswordForgotMutation();
  const {TEXT} = useText();
  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword({
        email: formik.values?.emailAddress,
      }).unwrap();
      console.log('forgot ', response);

      if (response?.success) {
        const token = response?.token;
        navigate(RouteNames.OTP_VERIFICATION, {
          token: token,
          type: 'forgotPassword',
          email: formik.values?.emailAddress,
        });
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        // Optionally, store or use the returned token
        console.log('Token:', response.token);
      } else {
        // showMessage({
        //   message: response.error,
        //   type: 'danger',
        // });
        // Alert.alert('Error', response?.error);
      }
    } catch (error: any) {
      const errMsg = error?.data?.error || 'Something went wrong';
      // showMessage({
      //   message: errMsg,
      //   type: 'danger',
      // });
      // Alert.alert('Error', errMsg);
    }
  };

  const formik = useFormik<ForgotPasswordFormikValues>({
    initialValues: {
      emailAddress: '',
    },
    // forgotValidationSchema(imported from "../../../utils/validations") is used to validate the email
    validationSchema: forgotValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleForgotPassword,
  });

  return (
    <AppView customViewStyle={{gap: SPACING.custom(28), marginTop: SPACING.l}}>
      <TouchableOpacity onPress={() => goBack()}>
        <ICON_BACK />
      </TouchableOpacity>
      <View style={{gap: SPACING.xxxs}}>
        <AppLabel
          text={TEXT.FORGOT_PASSWORD_HEADING}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(28)}
          fontFamily={FONT_FAMILY.Bold}
        />

        <AppLabel
          text={TEXT.FORGOT_PASSWORD_SUBTEXT}
          color={COLORS.TEXT_COLOR}
          fontSize={FONT_VARIENTS.custom(16)}
          fontFamily={FONT_FAMILY.Regular}
        />
      </View>

      <View>
        <AppTextInput
          placeholder={TEXT.ENTER_YOUR_EMAIL}
          leftIcon={<ICON_EMAIL />}
          input={formik.values.emailAddress}
          setInput={formik.handleChange('emailAddress')}
          isError={formik?.errors?.emailAddress}
        />
      </View>
      <AppButton
        text={TEXT.SUBMIT}
        onHandlePress={formik.handleSubmit}
        isLoading={isLoading}
      />
    </AppView>
  );
};

export default ForgotPassword;
