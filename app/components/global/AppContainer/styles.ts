import {StyleSheet} from 'react-native';
import {COLORS, scaleSize, SPACING} from '@theme';

const styles = StyleSheet.create({
  container: {
    // padding: SPACING.l,
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
    borderRadius: scaleSize(10),
    minHeight: scaleSize(55),
    padding: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BORDER_COLOR,
  },
});

export default styles;
