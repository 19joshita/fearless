import {ViewStyle} from 'react-native';

// props of buttons define here
export interface APPButtonProps {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  customStyle?: ViewStyle;
  leftStyle?: ViewStyle;
  rightStyle?: ViewStyle;
  onHandlePress?: () => void;
  leftIcon?: any;
  rightIcon?: any;
  disabled?: boolean;
  color?: string;
  fontWeight?: any;
  isLoading?: boolean;
  testID?: string;
}
