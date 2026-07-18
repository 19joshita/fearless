import { Dimensions, PixelRatio, Platform } from 'react-native';

// Define a base screen width for scaling (e.g., based on design)
const BASE_SCREEN_WIDTH = 375; // iPhone X width as reference
const BASE_SCREEN_HEIGHT = 812; // iPhone X height

// Optimized scalable font sizes

// export const fontResize = (fontSize: number): number => {
//   const screenWidth = Dimensions.get('window').width;
//   const scale = screenWidth / BASE_SCREEN_WIDTH; // Scale based on the current screen width
//   const newSize = fontSize * scale;

//   // Adjust size slightly based on platform for better accuracy
//   if (Platform.OS === 'ios') {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize));
//   } else {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
//   }
// };

// optimized font scalable with tablets handling

export const fontResize = (fontSize: number): number => {
  const { width, height } = Dimensions.get('window');
  const scaleWidth = width / BASE_SCREEN_WIDTH; // Width-based scaling
  const scaleHeight = height / BASE_SCREEN_HEIGHT; // Height-based scaling

  // Use the smaller scale factor for consistent results across devices
  const scale = Math.min(scaleWidth, scaleHeight);

  // Apply scaling to the font size
  const newSize = fontSize * scale;

  // Add limits to font scaling for tablets or very large devices
  const maxFontSize = fontSize * 1.3; // Limit the maximum font size to 130% of original
  const minFontSize = fontSize * 0.5; // Ensure a minimum of 50% of original font size

  // Adjust size slightly based on the platform
  let adjustedSize = Platform.OS === 'ios'
    ? Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1.5
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;

  // Clamp the size within defined min/max limits
  // return Math.max(minFontSize, Math.min(adjustedSize, maxFontSize));
  return adjustedSize
};

// new changes
// export const fontResize = (fontSize: number): number => {
//   const { width } = Dimensions.get('window');
//   const scale = Math.min(width / 375, 1.1); // iPhone 11 base width, capped at 1.1x
//   const newSize = fontSize * scale;

//   const maxFontSize = fontSize * 1.15; // cap at 115%
//   const minFontSize = fontSize * 0.9;  // don't go smaller than 90%

//   let adjustedSize = Platform.OS === 'ios'
//     ? Math.round(PixelRatio.roundToNearestPixel(newSize))
//     : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;

//   return Math.max(minFontSize, Math.min(adjustedSize, maxFontSize));
// };



// Default code as used in all other projects 

// export const fontResize = (fontSize: number) => {
//   const DEFAULT_RESIZE_SCREEN = Dimensions.get('window').width,
//     scale = Dimensions.get('window').width / DEFAULT_RESIZE_SCREEN,
//     newSize = fontSize * scale;
//   if (Platform.OS === 'ios') {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize));
//   } else {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize));
//   }
// };
