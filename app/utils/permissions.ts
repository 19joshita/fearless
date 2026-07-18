import {Platform, PermissionsAndroid, Alert} from 'react-native';

export const requestMediaPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    console.log('[Permissions] Requesting media permissions...');

    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);

    console.log(
      '[Permissions] Grant results:',
      JSON.stringify(grants, null, 2),
    );

    const cameraGranted =
      grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const micGranted =
      grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const imagesGranted =
      grants[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const videoGranted =
      grants[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const allGranted =
      cameraGranted && micGranted && imagesGranted && videoGranted;

    console.log('[Permissions] Camera:', cameraGranted);
    console.log('[Permissions] Microphone:', micGranted);
    console.log('[Permissions] Images:', imagesGranted);
    console.log('[Permissions] Videos:', videoGranted);
    console.log('[Permissions] All granted:', allGranted);

    if (!allGranted) {
      const deniedPermissions: string[] = [];
      if (!cameraGranted) deniedPermissions.push('Camera');
      if (!micGranted) deniedPermissions.push('Microphone');
      if (!imagesGranted) deniedPermissions.push('Images');
      if (!videoGranted) deniedPermissions.push('Videos');

      console.log('[Permissions] Denied:', deniedPermissions);
      Alert.alert(
        'Permission Denied',
        `Please grant permissions for: ${deniedPermissions.join(', ')}`,
      );
    }

    return allGranted;
  } catch (err) {
    console.error('[Permissions] Error:', err);
    return false;
  }
};

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    console.log('[Permissions] Requesting camera permission...');

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera permission to take photos/videos',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    console.log(
      '[Permissions] Camera granted:',
      granted === PermissionsAndroid.RESULTS.GRANTED,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('[Permissions] Camera error:', err);
    return false;
  }
};

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    console.log('[Permissions] Requesting microphone permission...');

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'App needs microphone permission to record audio',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    console.log(
      '[Permissions] Microphone granted:',
      granted === PermissionsAndroid.RESULTS.GRANTED,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('[Permissions] Microphone error:', err);
    return false;
  }
};

export const requestGalleryPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    console.log('[Permissions] Requesting gallery permissions...');
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);

    console.log(
      '[Permissions] Gallery grant results:',
      JSON.stringify(grants, null, 2),
    );

    const imagesGranted =
      grants[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const videoGranted =
      grants[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const allGranted = imagesGranted && videoGranted;

    console.log('[Permissions] Images access:', imagesGranted);
    console.log('[Permissions] Videos access:', videoGranted);
    console.log('[Permissions] Gallery access granted:', allGranted);

    if (!allGranted) {
      Alert.alert(
        'Permission Denied',
        'Please grant permission to access gallery',
      );
    }

    return allGranted;
  } catch (err) {
    console.error('[Permissions] Gallery error:', err);
    return true;
  }
};
