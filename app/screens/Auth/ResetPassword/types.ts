import {AuthRootStackParamList} from '@navigation-utils';
import {RouteProp} from '@react-navigation/native';
import {RouteNames} from '@utils';

export type ResetPasswordRouteProp = RouteProp<
  AuthRootStackParamList,
  typeof RouteNames.RESET_PASSWORD
>;

export interface ResetFormikValues {
  newPassword: string;
  confirmPassword: string;
}
