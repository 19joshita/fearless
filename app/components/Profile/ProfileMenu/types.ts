import {ComponentType, ReactNode} from 'react';
import {SvgProps} from 'react-native-svg';

export interface ProfileMenuProps {
  title: string;
  icon: ComponentType<SvgProps>;
  onPress: () => void;
}
