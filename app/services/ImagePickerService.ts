// services/ImagePickerService.js
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  requestCameraPermission,
  requestGalleryPermission,
} from './PermissionService';
import {Alert} from 'react-native';
import {openSettings} from 'react-native-permissions';

const options: CameraOptions = {
  mediaType: 'photo',
  quality: 0.9,
  maxWidth: 1024,
  maxHeight: 1024,
};

const pickImageFromCamera = async (): Promise<ImagePickerResponse> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert(
      'Permission Blocked',
      'Please enable the permission from settings to continue.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () =>
            openSettings().catch(() => Alert.alert('Unable to open settings')),
        },
      ],
    );
    throw new Error('Camera permission not granted');
  }

  return new Promise((resolve, reject) => {
    launchCamera(options, response => {
      if (response?.didCancel) {
        reject('User cancelled image picker');
      } else if (response?.errorCode) {
        reject(response.errorMessage);
      } else if (response?.assets) {
        resolve(response);
      } else {
        reject('Something went wrong');
      }
    });
  });
};

const pickImageFromGallery = async (): Promise<ImagePickerResponse> => {
  const hasPermission = await requestGalleryPermission();
  if (!hasPermission) {
    // Alert.alert(
    //   'Permission Blocked',
    //   'Please enable the permission from settings to continue.',
    //   [
    //     {text: 'Cancel', style: 'cancel'},
    //     {
    //       text: 'Open Settings',
    //       onPress: () =>
    //         openSettings().catch(() => Alert.alert('Unable to open settings')),
    //     },
    //   ],
    // );
  }

  return new Promise((resolve, reject) => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        reject('User cancelled image picker');
      } else if (response.errorCode) {
        reject(response.errorMessage);
      } else if (response?.assets) {
        resolve(response);
      } else {
        reject('Something went wrong');
      }
    });
  });
};

export {pickImageFromCamera, pickImageFromGallery};
