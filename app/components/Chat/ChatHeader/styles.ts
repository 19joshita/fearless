import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: SPACING.custom(12),
  },
  leftIcon: {
    left: 0,
    position: 'absolute',
    zIndex: 1,
    paddingRight: SPACING.xxs,
  },
  rightIcon: {
    right: 0,
    position: 'absolute',
    paddingLeft: SPACING.xxs,
  },

  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '70%',
    marginHorizontal: 'auto',
  },

  titleStyle: {
    fontSize: FONT_VARIENTS.custom(20),
    fontFamily: FONT_FAMILY.Semibold,
    textAlign: 'center',
  },

  statusText: {
    fontSize: scaleSize(11),
    fontFamily: FONT_FAMILY.Medium,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  statusOnline: {
    color: '#2E7D32',
    fontFamily:FONT_FAMILY.Medium,
    fontSize:14
  },

  statusOffline: {
    color: COLORS.GRAY_TEXT_COLOR,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.custom(10),
  },
});

export default styles;
