// utils/scaleSize.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Same baseline as your design (adjust if needed)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Scale width (for spacing, widths, horizontal padding/margin)
export const scaleWidth = (size: number) => {
  const scaled = (SCREEN_WIDTH / guidelineBaseWidth) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// Scale height (for vertical spacing, component heights, etc.)
export const scaleHeight = (size: number) => {
  const scaled = (SCREEN_HEIGHT / guidelineBaseHeight) * size;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// Optional: moderateScale like fontResize (more controlled scaling)
export const scaleSize = (size: number, factor = 0.5) => {
  const scaled = scaleWidth(size);
  return Math.round(size + (scaled - size) * factor);
};
