import {COLORS, screenWidth, SPACING} from '@theme';
import {StyleSheet} from 'react-native';
const boxWidth = (screenWidth - SPACING.custom(24) * 2) / 6;
const styles = StyleSheet.create({
  container: {
    gap: SPACING.m,
    // width: screenWidth - SPACING.custom(20),
    // justifyContent: 'space-between',
  },

  otpWrapper: {
    marginTop: 0,

    // alignItems: 'center',
    // backgroundColor: 'red',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    width: screenWidth - SPACING.custom(24) * 2,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  boxContainer: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    // gap: SPACING.s,
    // flexShrink: 1,
    // alignSelf: 'flex-start',
    // overflow: 'hidden',
    justifyContent: 'space-between',
  },
  box: {
    width: boxWidth - SPACING.s,
    height: 56,
    // marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedBox: {
    borderColor: COLORS.SECONDARY_COLOR,
  },
  boxText: {
    fontSize: 18,
    // fontWeight: '600',
  },
});

export default styles;
