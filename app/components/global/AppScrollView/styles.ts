import {COLORS, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_BACKGROUND,
  },
  contentContainerStyle: {
    paddingHorizontal: SPACING.custom(20),
    backgroundColor: COLORS.APP_BACKGROUND,
  },
});

export default styles;
