import {TextStyle} from 'react-native';

export interface ChatAnimatingTextProps {
  text: string;
  durationPerChar?: number;
  textStyle?: TextStyle;
  onTypingComplete?: () => void;
}
