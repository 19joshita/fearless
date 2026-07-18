import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

export interface ChatHeaderProps {
  title?: string;
  isLeftIcon?: boolean;
  customLeftIcon?: ReactNode;
  isRightIcon?: boolean;
  customRightIcon?: ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  onExportPress?: () => void;
  onEditChatPress?: () => void;
  onSavePress?: () => void;
  onDeletePress?: () => void;
  isDisabled?: boolean;
  isWarning?: boolean;
  customStyle?: ViewStyle;
  onlayout: (height: number) => void;
  isRightLastIcon?:boolean
  status?:'online'| 'offline'
}
