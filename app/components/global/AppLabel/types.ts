import {ReactNode} from 'react';
import {TextStyle} from 'react-native';

export interface AppLabelProps {
  text?: ReactNode | string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  textStyle?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
  lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip';
  testID?: string;
}
