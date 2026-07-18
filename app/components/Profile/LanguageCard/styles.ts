import {COLORS, scaleHeight, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.m,
    borderRadius: scaleSize(112),
    backgroundColor: COLORS.LIGHT_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BACKGROUND,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    flexGrow: 1,
    flexShrink: 1,
  },
  textStyle: {
    flexShrink: 1,
  },
});

export default styles;
