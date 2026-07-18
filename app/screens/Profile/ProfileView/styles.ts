import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.custom(14),
    backgroundColor: COLORS.LIGHT_BROWN,
    borderRadius: SPACING.custom(12),
  },
  editIconContainer: {
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: scaleSize(40) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE_COLOR,
  },
  textContainer: {
    // flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    gap: SPACING.xs,
  },
  titleStyle: {
    fontSize: FONT_VARIENTS.custom(20),
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.WHITE_COLOR,
  },
  descriptionStyle: {
    fontSize: FONT_VARIENTS.p,
    fontFamily: FONT_FAMILY.Medium,
    color: COLORS.WHITE_COLOR,
  },
});

export default styles;
