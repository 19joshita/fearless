import {ViewStyle} from 'react-native';

export type AppViewProps = {
  children?: React.ReactNode;
  customViewStyle?: ViewStyle | ViewStyle[];
  testID?: string;
  onStartShouldSetResponder?: () => boolean;
};
