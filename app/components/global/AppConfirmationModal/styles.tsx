import {COLORS, FONT_FAMILY, scaleSize} from '@theme';
import {StyleSheet} from 'react-native';
const style = StyleSheet.create({
  innerContainer: {
    // paddingHorizontal: size?.s16,
    marginHorizontal: scaleSize(16),
    paddingVertical: scaleSize(16),
    paddingBottom: scaleSize(20),
    borderRadius: scaleSize(24),
    paddingHorizontal: scaleSize(20),
    // alignItems:'center',
    justifyContent: 'center',
    // flexDirection:'row'
    backgroundColor: COLORS.LIGHT_BROWN,
  },
  actionTextStyle: {
    fontSize: scaleSize(20),
    fontFamily: FONT_FAMILY.Bold,
    textAlign: 'center',
    marginBottom: scaleSize(16),
    color: COLORS.WHITE_COLOR,
  },
  confirmationTextStyle: {
    fontSize: scaleSize(16),
    fontFamily: FONT_FAMILY.Medium,
    textAlign: 'center',
    color: COLORS.WHITE_COLOR,
    // paddingHorizontal: scaleSize(24),
    marginBottom: scaleSize(20),
  },
});

export default style;
