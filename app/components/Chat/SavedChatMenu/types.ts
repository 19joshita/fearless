import {ComponentType, ReactNode} from 'react';
import {SvgProps} from 'react-native-svg';

export interface SavedChatMenuProps {
  title: string;
  icon: ComponentType<SvgProps>;
  onPress: () => void;
  date: string;
  contextMenuVisble: boolean;
  onChangeMenu: () => void;
  onViewPress: () => void;
  onDeletePress: () => void;
  isAgent: boolean;
}
