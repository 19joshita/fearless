import {TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {AppContainerProps} from './types';
import {COLORS} from '@theme';
import Animated, {LinearTransition} from 'react-native-reanimated';

const AppContainer: FC<AppContainerProps> = ({
  children,
  customStyle,
  disabled,
  onPress,
  loading,
}) => {
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const _layout = LinearTransition.springify().damping(14);
  return (
    <AnimatedTouchable
      testID={'app-container'}
      layout={_layout}
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, customStyle]}>
      {loading ? (
        <ActivityIndicator
          testID="activity-indicator"
          size={'small'}
          color={COLORS.PRIMARY_COLOR}
        />
      ) : (
        children
      )}
    </AnimatedTouchable>
  );
};

export default AppContainer;
