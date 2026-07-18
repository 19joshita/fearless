import React, {FC} from 'react';
import {View, Text, Modal, ViewStyle, Platform} from 'react-native';
import styles from './styles';
import {IAppModal} from './types';

const AppModal: FC<IAppModal> = ({
  visible,
  onClose,
  animationType = 'slide',
  children,
  customStyle = {},
}) => {
  const isNavigationBarTranslucent =
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version >= 35);
  return (
    <Modal
      statusBarTranslucent
      navigationBarTranslucent={isNavigationBarTranslucent}
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType={animationType}>
      <View style={{...styles.container, ...customStyle}}>{children}</View>
    </Modal>
  );
};
export default AppModal;
