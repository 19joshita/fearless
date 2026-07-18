import {COLORS, scaleSize} from '@theme';
import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    height: scaleSize(50),
    width: scaleSize(50),
    overflow: 'hidden',
    borderRadius: scaleSize(50) / 2,
    borderWidth: 2,
    borderColor: COLORS.WHITE_COLOR,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});

export default style;
