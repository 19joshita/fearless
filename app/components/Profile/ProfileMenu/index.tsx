import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {ProfileMenuProps} from './types';
import styles from './styles';
import {AppLabel} from '@global-components';
import {ICON_FORWARD} from '@assets/icons';

const ProfileMenu: FC<ProfileMenuProps> = ({icon, title, onPress}) => {
  const ICON = icon;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.flexRow, styles.container]}>
      <View style={[styles.flexRow, styles.iconTitleContainer]}>
        <View style={styles.iconContainer}>
          <ICON />
        </View>
        <AppLabel textStyle={styles.titleStyle} text={title} />
      </View>
      <ICON_FORWARD />
    </TouchableOpacity>
  );
};

export default ProfileMenu;
