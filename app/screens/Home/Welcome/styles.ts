import {COLORS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  imageStyle: {
    alignSelf: 'center',
  },
  promptContainer: {
    backgroundColor: COLORS.LIGHT_BROWN,
    paddingVertical: SPACING.custom(18),
    paddingHorizontal: SPACING.custom(30),
    gap: SPACING.custom(20),
    borderRadius: SPACING.custom(12),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_BORDER_COLOR,
    alignSelf: 'center'
  },
  iconContainer: {
    padding: SPACING.custom(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: SPACING.custom(20),
    height: scaleSize(62),
    aspectRatio: 1,
    alignSelf: 'center'
  },
  iconsRow: {
    gap: SPACING.custom(30),
    flexDirection:'row',
    alignItems: 'center'
  }
});

export default styles;