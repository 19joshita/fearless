import {COLORS, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  imageStyle: {
    alignSelf: 'center',
  },
  promptContainer: {
    backgroundColor: COLORS.OFF_WHITE,
    padding: SPACING.m,
    gap: SPACING.custom(20),
    borderRadius: SPACING.custom(12),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BORDER_COLOR,
  },
  promptTextContainer: {
    borderRadius: SPACING.custom(10),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BROWN,
    backgroundColor: COLORS.PROMPT_BG,
    padding: SPACING.m,
  },
});

export default styles;
