import {ICON_CHECK} from '@assets/icons';
import React, {FC, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AppCheckboxProps} from './types';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import AppLabel from '../AppLabel';
import Animated, {LinearTransition} from 'react-native-reanimated';

const AppCheckbox: FC<AppCheckboxProps> = ({
  title,
  onChange,
  checked = false,
  error,
}) => {
  return (
    <Animated.View layout={LinearTransition.springify().damping(14)}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onChange(!checked)}>
        <View style={styles.checkbox}>{checked && <ICON_CHECK />}</View>
        <AppLabel
          text={title}
          fontSize={FONT_VARIENTS.custom(14)}
          fontFamily={FONT_FAMILY.Regular}
        />
      </TouchableOpacity>
      {error && (
        <AppLabel
          text={error}
          fontSize={FONT_VARIENTS.custom(12)}
          fontFamily={FONT_FAMILY.Regular}
          color={COLORS.ERROR}
          // textStyle={{marginLeft: '2%'}}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(10),
    gap: SPACING.s,
  },
  checkbox: {
    width: scaleSize(20),
    height: scaleSize(20),
    borderWidth: 1,
    borderColor: COLORS.TEXT_COLOR,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppCheckbox;
