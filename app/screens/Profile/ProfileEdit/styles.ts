import {COLORS, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  imageStyle: {
    height: scaleSize(150),
    width: scaleSize(150),
    borderRadius: scaleSize(150) / 2,
    borderWidth: scaleSize(4),
    borderColor: COLORS.TEXT_COLOR,
    alignSelf: 'center',
    aspectRatio: 1,
  },
  inputsContainer: {
    gap: SPACING.custom(28),
    paddingTop: SPACING.l,
  },
  deleteAccountText: {
    color: COLORS.SECONDARY_COLOR,
    fontSize: FONT_VARIENTS.h4,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: SPACING.xxxl,
  },
  disbaledTextInputStyle: {
    backgroundColor: COLORS.DISABLED_INPUT_BACKGROUND_COLOR,
    color: COLORS.DISABLED_TEXT_COLOR,
  },
  imageContainer: {
    alignSelf: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    bottom: -scaleSize(4),
    right: scaleSize(30),
  },
});

export default styles;
