import {ViewStyle} from 'react-native';

export interface AppContainerProps {
  children?: React.ReactNode;
  customStyle?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  onPress?: (arg?: any) => void;
  loading?: boolean;
}
