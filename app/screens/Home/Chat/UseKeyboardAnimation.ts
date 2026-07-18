import {useKeyboardHandler} from 'react-native-keyboard-controller';
import {useSharedValue} from 'react-native-reanimated';

const useKeyboardAnimation = () => {
  const PADDING_BOTTOM = 0;
  const height = useSharedValue(PADDING_BOTTOM);

  useKeyboardHandler(
    {
      onMove: e => {
        'worklet';
        height.value = Math.max(e.height, PADDING_BOTTOM);
      },
    },
    [],
  );

  return {height};
};

export default useKeyboardAnimation;
