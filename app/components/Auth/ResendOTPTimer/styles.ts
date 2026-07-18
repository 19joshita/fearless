import {COLORS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  resendContainer: {
    alignSelf: 'flex-start',
    width: 'auto',
    height: 'auto',
    minHeight: undefined,
    padding: SPACING.s,
    borderRadius: scaleSize(20),
    backgroundColor: 'transparent',
  },
});

export default styles;
