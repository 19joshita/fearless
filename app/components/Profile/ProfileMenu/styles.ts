import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.custom(20),
    paddingHorizontal: SPACING.m,
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: SPACING.custom(20),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTitleContainer: {
    gap: SPACING.m,
    flexGrow: 1,
    flexShrink: 1,
  },
  iconContainer: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: SPACING.custom(12),
    backgroundColor: COLORS.APP_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: FONT_VARIENTS.h6,
    fontFamily: FONT_FAMILY.Semibold,
    color: COLORS.BODY_TEXT_COLOR,
    flexShrink: 1,
  },
});
export default styles;
