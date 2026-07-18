import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    height: 500,
    width: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
