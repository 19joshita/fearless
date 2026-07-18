import {ReactNode} from 'react';

export interface AppHeaderProps {
  title?: string;
  isLeftIcon?: boolean;
  customLeftIcon?: ReactNode;
  isRightIcon?: boolean;
  customRightIcon?: ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}
