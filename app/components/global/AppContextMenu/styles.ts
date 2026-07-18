import {COLORS, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_COLOR,
    paddingVertical: SPACING.custom(20),
    paddingHorizontal: SPACING.custom(12),
    borderRadius: SPACING.custom(10),
    borderWidth: 1,
    borderColor: '#0000001A',
    position: 'absolute',
    zIndex: 99999999,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  menuItem: {
    paddingBottom: SPACING.custom(12),
    borderBottomWidth: 1,
    borderColor: '#0000000D',
    marginBottom: SPACING.custom(12),
  },
  menuItemLast: {
    // paddingTop: SPACING.custom(12),
  },
});
export default styles;
