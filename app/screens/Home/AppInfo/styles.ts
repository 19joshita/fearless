import {screenHeight, SPACING} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: SPACING.s,
  },
  scrollViewContainer: {
    paddingTop: 0,
  },
  contentContainerStyle: {
    gap: SPACING.custom(12),
    paddingHorizontal: 0,
  },
  lodingIndicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.2,
  },
});

export default styles;
