import {TEXT} from '@constants';
import {translate} from '@localization';
import * as yup from 'yup';

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// const passwordRegex: any =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]{8,}$/;

export const loginValidationSchema = () =>
  yup.object({
    emailAddress: yup
      .string()
      .email(translate('INVALID_EMAIL'))
      .required(translate('EMAIL_REQUIRED'))
      .test('is-valid-domain', translate('INVALID_EMAIL'), value => {
        if (!value) return false; // Handle empty values if required
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      }),

    password: yup
      .string()
      .required(translate('PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      // .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL')),
  });

export const signupValidationSchema = () =>
  yup.object({
    userName: yup
      .string()
      .min(2, translate('MIN_LENGTH'))
      .max(50, translate('MAX_ALLOWED'))
      .matches(/^[A-Za-zÀ-ÿ ]+$/, translate('INVALID_INPUT'))
      .required(translate('FIRST_NAME_REQUIRED')),

    coporateCode: yup.string(),

    emailAddress: yup
      .string()
      .email(translate('INVALID_EMAIL'))
      .required(translate('EMAIL_REQUIRED'))
      .test('is-valid-domain', translate('INVALID_EMAIL'), value => {
        if (!value) return false; // Handle empty values if required
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      }),

    password: yup
      .string()
      .required(translate('PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL')),

    confirmPassword: yup
      .string()
      .required(translate('CONFIRM_PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL'))
      .oneOf([yup.ref('password')], translate('PASSWORD_MATCH')),

    agreed: yup.boolean().oneOf([true], translate('AGREEMENT_REQUIRED')),
  });

export const forgotValidationSchema = () =>
  yup.object({
    emailAddress: yup
      .string()
      .required(translate('EMAIL_REQUIRED'))
      .email(translate('INVALID_EMAIL'))
      .test('is-valid-domain', translate('INVALID_EMAIL'), value => {
        if (!value) return false; // Handle empty values if required
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      }),
  });

export const resetValidationSchema = () =>
  yup.object({
    newPassword: yup
      .string()
      .required(translate('PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL')),

    confirmPassword: yup
      .string()
      .required(translate('CONFIRM_PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL'))
      .oneOf([yup.ref('newPassword')], translate('PASSWORD_MATCH')),
  });

export const otpValidationSchema = () =>
  yup.object().shape({
    otp: yup
      .string()
      .length(6, translate('OTP_LENGTH'))
      .matches(/^\d+$/, translate('OTP_NUMERIC'))
      .required(translate('OTP_REQUIRED')),
  });

export const profileValidationSchema = () =>
  yup.object({
    emailAddress: yup
      .string()
      .email(translate('INVALID_EMAIL'))
      .required(translate('EMAIL_REQUIRED'))
      .test('is-valid-domain', translate('INVALID_EMAIL'), value => {
        if (!value) return false; // Handle empty values if required
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      }),

    userName: yup
      .string()
      .min(2, translate('FIRST_NAME_REQUIRED'))
      .max(50, translate('CHARACTER_LIMIT'))
      // .matches(/^[A-Za-z ]*$/, translate('INVALID_FIRST_NAME'))
      .matches(/^[A-Za-zÀ-ÿ ]+$/, translate('INVALID_INPUT'))
      .required(translate('FIRST_NAME_REQUIRED')),
  });

export const changePasswordValidationSchema = () =>
  yup.object({
    currentPassword: yup
      .string()
      .required(translate('PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL')),

    newPassword: yup
      .string()
      .required(translate('PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL')),

    confirmPassword: yup
      .string()
      .required(translate('CONFIRM_PASSWORD_REQUIRED'))
      .min(8, translate('PASSWORD_MINIMUM_CHAR'))
      .max(15, translate('PASSWORD_MAXIMUM_CHAR'))
      .matches(/[0-9]/, translate('PASSWORD_CONTAIN_NUM'))
      .matches(/[a-z]/, translate('PASSWORD_CONTAIN_CHAR_LOWER'))
      .matches(/[A-Z]/, translate('PASSWORD_CONTAIN_CHAR_UPPER'))
      .matches(/[^\w]/, translate('PASSWORD_CONTAIN_CHAR_SYMBOL'))
      .oneOf([yup.ref('newPassword')], translate('PASSWORD_MATCH')),
  });

export const getAuthFormValidationSchema = (
  step: number,
  isSocial: boolean,
  type: string,
) => {
  if (type === 'login') {
    return yup.object().shape({
      otp: yup
        .string()
        .length(6, 'OTP must be 6 digits.')
        .required('This field is required.'),
    });
  }

  switch (step) {
    case 0:
      return yup.object().shape({
        firstName: yup.string().required('This field is required.'),
        lastName: yup.string(),
        email: isSocial
          ? yup.string()
          : yup
              .string()
              .email('Please enter a valid email.')
              .required('This field is required.'),
        phone: isSocial
          ? yup.string().required('This field is required.')
          : yup.string(),
      });
    case 1:
      return yup.object().shape({
        otp: yup
          .string()
          .length(6, 'OTP must be 6 digit.s')
          .required('This field is required.'),
      });
    case 2:
      return yup.object().shape({
        termsAgree: yup.boolean().oneOf([true], 'You must agree to the terms.'),
      });
    default:
      return yup.object();
  }
};

// export const mobileValidations = yup.object({
//   mobile: yup
//     .string()
//     .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number.')
//     .required('This field is required.'),
// });

export const mobileValidations = yup.object({
  mobile: yup
    .string()
    .required('This field is required.')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number.')
    .test(
      'not-all-same',
      'Please enter a valid 10-digit mobile number.',
      value => {
        if (!value) return false;
        return !/^(\d)\1{9}$/.test(value); // checks if all digits are the same
      },
    ),
});
