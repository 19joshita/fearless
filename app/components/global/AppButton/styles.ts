import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.custom(16),
    paddingHorizontal: SPACING.custom(18),
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: SPACING.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTxt: {
    color: COLORS.PRIMARY_COLOR,
    fontFamily: FONT_FAMILY.Bold,
    textAlign: 'center',
    fontSize: FONT_VARIENTS.h5,
    includeFontPadding: false,
  },
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    flexDirection: 'row',
    borderRadius: scaleSize(112),
  },
  textStyle: {
    // paddingHorizontal: SPACING.xxxs,
  },
});

export default styles;
