import {ICON_TICK} from '@assets/icons';
import {AppLabel} from '@components';
import {COLORS, scaleSize, screenWidth} from '@theme';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Toast, {ToastShowParams} from 'react-native-toast-message';

const ToastSuccess = ({
  text1,
  visibilityTime = 4000,
  onPress,
}: ToastShowParams) => {
  const progress = useSharedValue(1);
  const totalWidth = screenWidth - scaleSize(50);

  useEffect(() => {
    // Reset progress to 1 when component mounts (new toast)
    progress.value = 1;

    // Start animation with the actual visibilityTime after a small delay
    const timer = setTimeout(() => {
      progress.value = withTiming(0, {
        duration: visibilityTime,
      });
    }, 50); // Small delay to ensure reset happens first

    return () => clearTimeout(timer);
  }, [visibilityTime]); // Re-run when visibilityTime changes

  const animatedStyle = useAnimatedStyle(() => {
    return {
      right: interpolate(progress.value, [1, 0], [0, totalWidth]),
    };
  });

  return (
    <Pressable
      style={styles.contaimer}
      onPress={onPress}
      onLongPress={() => Toast.hide()} // 👈 hide on long press
      delayLongPress={200}
      unstable_pressDelay={0}>
      <View style={styles.toastContainer}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <ICON_TICK />
          </View>
          <AppLabel
            text={text1}
            color={COLORS.WHITE_COLOR}
            textStyle={{maxWidth: '80%'}}
          />
        </View>
      </View>
      {/* <Animated.View style={[styles.progressBar, animatedStyle]} /> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    paddingVertical: scaleSize(12),
    paddingHorizontal: scaleSize(16),
  },
  contaimer: {
    borderRadius: scaleSize(8),
    overflow: 'hidden',
    width: screenWidth - scaleSize(50),
    backgroundColor: COLORS.LIGHT_BROWN,
    marginHorizontal: scaleSize(30),
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(16),
  },
  iconCircle: {
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(32) / 2,
    backgroundColor: COLORS.WHITE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.SUCCESS,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ToastSuccess;
