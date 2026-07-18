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
  renameInputStyle: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: COLORS.WHITE_COLOR,
    paddingHorizontal: 0,
    minHeight: undefined,
    paddingBottom: SPACING.s,
    marginVertical: SPACING.s,
  },
  warningStyle: {
    backgroundColor: 'rgba(175, 43, 49, 0.7)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    alignSelf: 'center',
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: SPACING.custom(12),
  },
});

export default styles;
