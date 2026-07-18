import {SPACING} from '@theme';
import {Dimensions, StyleSheet} from 'react-native';

const {height, width} = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    // width: '100%',
    // height: '100%',
    width: width,
    height: height,
    resizeMode: 'stretch',
  },
  authConatiner: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    gap: SPACING.m,
  },
  logoContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '6%',
  },
});

export default styles;
