import {COLORS, screenHeight, screenWidth} from '@theme';
import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    backgroundColor: COLORS.BLACK_OPACITY_COLOR,
  },
  childContainer: {
    flex: 1,
  },
});
export default styles;
