import {Dimensions} from 'react-native';
import {fontResize} from './fontResize';
import {scaleHeight, scaleWidth, scaleSize} from './responsiveSize';
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

const FONT_VARIENTS = {
  h1: fontResize(32),
  h2: fontResize(28),
  h3: fontResize(24),
  h4: fontResize(20),
  h5: fontResize(18),
  h6: fontResize(16),
  p: fontResize(12),
  small: fontResize(10),
  extra_small: fontResize(8),
  custom: (size: number) => fontResize(size),
};

const SPACING = {
  xxxs: scaleSize(2),
  xxs: scaleSize(4),
  xs: scaleSize(6),
  s: scaleSize(8),
  m: scaleSize(16),
  l: scaleSize(24),
  xl: scaleSize(32),
  xxl: scaleSize(40),
  xxxl: scaleSize(48),
  custom: (size: number) => scaleSize(size),
};

const FONT_FAMILY = {
  Bold: 'Urbanist-Bold', //700
  ExtraBold: 'Urbanist-ExtraBold', //800
  ExtraLight: 'Urbanist-ExtraLight', //200
  Light: 'Urbanist-Light', //300
  Medium: 'Urbanist-Medium', //500
  Regular: 'Urbanist-Regular', //400
  Semibold: 'Urbanist-SemiBold', //600
  Black: 'Urbanist-Black', //900
  thin: 'Urbanist-Thin', //200
};

const COLORS = {
  PRIMARY_COLOR: '#FFFFFF',
  SECONDARY_COLOR: '#AF2B31',
  TEXT_COLOR: '#4A4A48',
  DISABLED_TEXT_COLOR: '#4A4A4866',
  GRAY_TEXT_COLOR: '#A9ABB0',
  INPUT_BACKGROUND_COLOR: '#FDFCFA',
  DISABLED_INPUT_BACKGROUND_COLOR: '#FDFCFA38',
  LIGHT_BORDER_COLOR: '#1F1F1F14',
  APP_BACKGROUND: '#F5F4EF',
  ERROR: 'red',
  WHITE_COLOR: '#ffffff',
  WHITE_BUTTON_COLOR: '#FDFCFA',
  BUTTON_BORDER_COLOR: '#CCCCCB',
  BODY_TEXT_COLOR: '#4A4A48',
  PLACEHOLDER_COLOR: '#6F6F6E',
  TABS_BG: '#E7E6DC',
  SUCCESS: '#01E17B',
  LIGHT_BROWN: '#B0987D',
  ERROR_PROGRESS: '#F04349',
  LIGHT_BACKGROUND: '#BAA18414',
  OFF_WHITE: '#E9E8DD',
  BLACK_OPACITY_COLOR: 'rgba(0,0,0,0.6)',
  PROMPT_BG: '#CEC1B2',
};

export {
  fontResize,
  scaleHeight,
  scaleWidth,
  scaleSize,
  FONT_VARIENTS,
  SPACING,
  screenHeight,
  screenWidth,
  FONT_FAMILY,
  COLORS,
};
