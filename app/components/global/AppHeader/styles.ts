import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '100%',
    paddingVertical: SPACING.custom(12),
  },
  leftIcon: {
    left: 0,
    position: 'absolute',
    zIndex: 1,
  },
  rightIcon: {
    right: 0,
    position: 'absolute',
  },
  titleStyle: {
    fontSize: FONT_VARIENTS.custom(20),
    fontFamily: FONT_FAMILY.Semibold,
    textAlign: 'center',
    flex: 1,
  },
});

export default styles;
