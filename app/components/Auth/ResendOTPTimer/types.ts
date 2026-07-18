import {JSX} from 'react';
import {ViewStyle, TextStyle} from 'react-native';

/**
 * Props interface for ResendOTPTimer component
 */
export interface ResendOTPTimerProps {
  /**
   * Initial countdown time in seconds
   * @default 60
   */
  initialSeconds?: number;

  /**
   * Maximum number of allowed resends
   * @default 3
   */
  maxResends?: number;

  /**
   * Callback function triggered when resend is pressed
   */
  onResendPress?: () => Promise<boolean>;

  /**
   * Flag to indicate if an API call is in progress
   * @default false
   */
  isPending?: boolean;

  /**
   * Additional style for the container
   */
  style?: ViewStyle;

  /**
   * Style for the text elements
   */
  textStyle?: TextStyle;

  /**
   * Style for the resend button
   */
  buttonStyle?: ViewStyle;

  /**
   * Style for the resend button text
   */
  buttonTextStyle?: TextStyle;
}
