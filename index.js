/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import Animated from 'react-native-reanimated';

// Firebase background notification handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Notification:', remoteMessage);
  console.log('Background Notification Data:', JSON.stringify(remoteMessage.data));
});

// Font scaling configuration
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

if (Animated.Text.defaultProps) {
  Animated.Text.defaultProps.allowFontScaling = false;
} else {
  Animated.Text.defaultProps = {};
  Animated.Text.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => App);