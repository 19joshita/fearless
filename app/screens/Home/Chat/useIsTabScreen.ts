// useIsTabScreen.ts
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

/**
 * Hook to determine if the current screen is inside a Tab Navigator.
 * @returns {boolean} True if the screen is within a Tab Navigator.
 */
const useIsTabScreen = (): boolean => {
  try {
    const height = useBottomTabBarHeight();
    return height > 0;
  } catch {
    return false;
  }
};

export default useIsTabScreen;
