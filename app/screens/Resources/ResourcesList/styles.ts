import {
  FONT_FAMILY,
  FONT_VARIENTS,
  scaleHeight,
  scaleSize,
  scaleWidth,
  screenHeight,
  SPACING,
} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(128),
    // height: scaleWidth(128),
    // aspectRatio: 1,
    borderRadius: SPACING.custom(12),
    gap: SPACING.s,
    // marginHorizontal: SPACING.s,
    marginBottom: SPACING.m,
    // justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: FONT_VARIENTS.custom(14),
    fontFamily: FONT_FAMILY.Semibold,
    textAlign: 'center',
  },
  imageStyle: {
    width: '100%',
    // height: screenHeight * 0.35,
    // height: scaleHeight(240),
    // borderRadius: SPACING.custom(16),
    height: scaleWidth(128),
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: SPACING.custom(12),
  },
  headerContainer: {
    alignSelf: 'center',
    gap: SPACING.s,
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  headerImage: {
    borderRadius: 0,
    borderWidth: 0,
    width: scaleSize(104),
    height: scaleSize(104),
  },
  headerText: {
    fontSize: FONT_VARIENTS.h6,
    fontFamily: FONT_FAMILY.Medium,
    textAlign: 'center',
    // textTransform: 'uppercase',
  },
});

export default styles;
