import {COLORS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.custom(12),
    overflow: 'hidden',
    backgroundColor: COLORS.OFF_WHITE,
  },
  innerContainer: {
    margin: SPACING.m,
  },
  topLine: {
    height: scaleSize(8),
    backgroundColor: COLORS.LIGHT_BROWN,
  },
});

export default styles;
