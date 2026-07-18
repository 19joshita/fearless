import {View, TouchableOpacity} from 'react-native';
import React, {FC, useEffect} from 'react';
import styles from './styles';
import AppLabel from '../AppLabel';
import {FONT_FAMILY, FONT_VARIENTS, scaleSize} from '@theme';
import {AppContextMenuProps} from './types';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AppContextMenu: FC<AppContextMenuProps> = ({
  customStyle,
  menuData,
  onClose,
  position = 'bottom',
}) => {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {damping: 10, stiffness: 100});
    opacity.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
      // transformOrigin: 'top right',
      transformOrigin: position === 'bottom' ? 'top right' : 'bottom right',
    };
  });

  return (
    <Animated.View
      style={[
        {
          right: 0,
          top: position === 'bottom' ? scaleSize(30) : -scaleSize(30),
          // bottom: position === 'top' ? scaleSize(30) : undefined,
          ...styles.container,
          ...customStyle,
        },
        animatedStyle,
      ]}>
      {menuData?.map((menu, index) => (
        <TouchableOpacity
          onPress={() => {
            menu?.onPress && menu?.onPress();
            onClose && onClose();
          }}
          style={
            index < menuData?.length - 1 ? styles.menuItem : styles.menuItemLast
          }
          key={index?.toString()}>
          <View style={styles.flexRow}>
            {menu?.icon}
            <AppLabel
              text={menu?.label}
              fontFamily={FONT_FAMILY.Medium}
              fontSize={FONT_VARIENTS.h6}
            />
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default AppContextMenu;
