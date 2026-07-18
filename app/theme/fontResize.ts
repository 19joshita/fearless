// utils/fontResize.ts
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 13 baseline dimensions (can change to any target design baseline)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Horizontal scale (based on width)
const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

// Vertical scale (optional, for height-specific scaling)
const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

// Moderate scale — a mix of both for balance
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/**
 * fontResize adjusts the font size based on device screen size.
 * @param size Base font size from design (e.g. 14, 16, etc.)
 * @param factor Optional: How aggressive scaling should be (0 to 1). Default is 0.5.
 */
export const fontResize = (size: number, factor = 0.5): number => {
  const newSize = moderateScale(size, factor);

  // Round the value to nearest pixel for better display
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
