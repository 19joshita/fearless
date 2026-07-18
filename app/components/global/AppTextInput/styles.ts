import {
  COLORS,
  FONT_FAMILY,
  FONT_VARIENTS,
  scaleSize,
  screenHeight,
  screenWidth,
  SPACING,
} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  // container: {
  //     backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
  //     padding: SPACING.custom(18),
  //     borderRadius: SPACING.s,
  //     borderWidth: 1,
  //     borderColor: COLORS.LIGHT_BORDER_COLOR,
  //     gap: SPACING.custom(18),
  //     alignItems: 'center'
  // },
  // textStyle: {
  //     fontSize: FONT_VARIENTS.custom(14),
  //     color: COLORS.SECONDARY_COLOR,
  //     fontFamily: FONT_FAMILY.Medium,
  //     backgroundColor:'red',
  //     includeFontPadding: false,
  //     width: '100%',
  //     padding: 0,
  // },
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  textStyle: {
    // paddingVertical: screenWidth * 0.01,
  },
  inputContainer: {
    // marginVertical: CONSTANTS.THEME.size.WIDTH * 0.0001,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: scaleSize(20),

    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BORDER_COLOR,
    backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
    minHeight: scaleSize(62),
  },
  inputStyle: {
    // borderRadius: scaleSize(8),

    color: COLORS.BODY_TEXT_COLOR,
    fontSize: FONT_VARIENTS.custom(16),
    fontFamily: FONT_FAMILY.Regular,
    includeFontPadding: false,
  },
  actionIcon: {
    // marginHorizontal: SPACING.custom(10),
    // height: scaleSize(20),
    // width: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorStyle: {
    marginHorizontal: screenWidth * 0.01,
    paddingHorizontal: SPACING.m,
    color: 'red',
    letterSpacing: 1,
    paddingVertical: screenHeight * 0.002,
  },
  errorView: {
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.03,
    alignItems: 'center',
    marginVertical: '1.5%',
  },
});

export default styles;
