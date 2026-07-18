import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {ICON_BACK, ICON_GLOBE} from '@assets/icons';
import AppLabel from '../AppLabel';
import {AppHeaderProps} from './types';
import {goBack, navigate} from '@navigation-utils';
import {RouteNames} from '@utils';

const AppHeader: FC<AppHeaderProps> = ({
  title,
  isLeftIcon = true,
  isRightIcon = true,
  customLeftIcon,
  customRightIcon,
  onLeftIconClick,
  onRightIconClick,
}) => {
  return (
    <View style={styles.container}>
      {isLeftIcon && (
        <TouchableOpacity
          hitSlop={20}
          onPress={() => (onLeftIconClick ? onLeftIconClick() : goBack())}
          style={styles.leftIcon}>
          {customLeftIcon ? customLeftIcon : <ICON_BACK />}
        </TouchableOpacity>
      )}
      <AppLabel text={title || 'Header'} textStyle={styles.titleStyle} />
      {isRightIcon && (
        <TouchableOpacity
          onPress={
            onRightIconClick
              ? onRightIconClick
              : () => navigate(RouteNames.LANGUAGE_STACK)
          }
          style={styles.rightIcon}>
          {customRightIcon ? customRightIcon : <ICON_GLOBE />}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppHeader;
