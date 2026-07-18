import {ViewStyle} from 'react-native';

export interface IAppModal {
  visible: boolean;
  onClose: () => void;
  animationType?: 'none' | 'slide' | 'fade' | undefined;
  children: any;
  customStyle?: ViewStyle;
}
