import {AppLabel} from '@components';
import {COLORS, FONT_VARIENTS, SPACING} from '@theme';
import {Alert, Animated, StyleSheet, View} from 'react-native';
import Toast, {ToastConfig, ToastShowParams} from 'react-native-toast-message';
import ToastSuccess from './toastSuccess';
import ToastError from './toastError';

export const TOAST_CONFIG: ToastConfig = {
  success: (props: ToastShowParams) => (
    <ToastSuccess {...props} onPress={Toast.hide} />
  ),
  error: (props: ToastShowParams) => (
    <ToastError {...props} onPress={Toast.hide} />
  ),
};
