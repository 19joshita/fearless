import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

interface MenuData {
  label?: string;
  icon?: ReactNode;
  onPress?: () => void;
}

export interface AppContextMenuProps {
  customStyle?: ViewStyle;
  menuData: MenuData[];
  onClose?: () => void;
  position: 'top' | 'bottom';
}
