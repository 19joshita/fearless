// services/PermissionsService.js
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

async function checkAndRequest(permission: Permission) {
  const status = await check(permission);
  switch (status) {
    case RESULTS.UNAVAILABLE:
      Alert.alert(
        'Permission not available',
        'This feature is not supported on your device.',
      );
      return false;

    case RESULTS.DENIED: {
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }

    case RESULTS.GRANTED:
      return true;
    case RESULTS.BLOCKED:
      Alert.alert(
        'Permission Blocked',
        'Please enable the permission from settings to continue.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () =>
              openSettings().catch(() =>
                Alert.alert('Unable to open settings'),
              ),
          },
        ],
      );
      return false;

    default:
      return false;
  }
}

export async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    return await checkAndRequest(PERMISSIONS.ANDROID.CAMERA);
  } else {
    return await checkAndRequest(PERMISSIONS.IOS.CAMERA);
  }
}

export async function requestGalleryPermission() {
  if (Platform.OS === 'android') {
    const permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    return await checkAndRequest(permission);
  } else {
    return await checkAndRequest(PERMISSIONS.IOS.PHOTO_LIBRARY);
  }
}
