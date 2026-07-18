import {Alert} from 'react-native';
import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import {requestCameraPermission, requestGalleryPermission} from './permissions';

export interface MediaFile {
  uri: string;
  type: string;
  fileName?: string;
  duration?: number;
  fileSize?: number;
  width?: number;
  height?: number;
}

export type MediaType = 'image' | 'video' | 'audio';

const handlePickerResponse = (
  response: ImagePickerResponse,
  onSuccess: (media: MediaFile, mediaType: MediaType) => void,
) => {
  console.log('[MediaPicker] Response received:', JSON.stringify({
    didCancel: response.didCancel,
    errorCode: response.errorCode,
    errorMessage: response.errorMessage,
    assetsCount: response.assets?.length || 0,
  }, null, 2));

  if (response.didCancel) {
    console.log('[MediaPicker] User cancelled the picker');
    return;
  }

  if (response.errorCode) {
    console.error('[MediaPicker] Error:', response.errorCode, response.errorMessage);
    Alert.alert('Error', response.errorMessage || 'Something went wrong');
    return;
  }

  if (response.assets && response.assets.length > 0) {
    const asset = response.assets[0];
    
    console.log('[MediaPicker] Selected asset:', JSON.stringify({
      uri: asset.uri,
      type: asset.type,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
      duration: asset.duration,
    }, null, 2));

    const mediaFile: MediaFile = {
      uri: asset.uri || '',
      type: asset.type || '',
      fileName: asset.fileName || undefined,
      duration: asset.duration || undefined,
      fileSize: asset.fileSize || undefined,
      width: asset.width || undefined,
      height: asset.height || undefined,
    };

    const mediaType: MediaType = asset.type?.startsWith('video') ? 'video' : 'image';
    
    console.log('[MediaPicker] Processed mediaType:', mediaType);
    console.log('[MediaPicker] Calling onSuccess callback');
    
    onSuccess(mediaFile, mediaType);
  }
};

export const openGallery = async (
  onSuccess: (media: MediaFile, mediaType: MediaType) => void,
) => {
  console.log('[MediaPicker] Opening gallery...');

  const hasPermission = await requestGalleryPermission();
  
  if (!hasPermission) {
    console.log('[MediaPicker] Gallery permission denied');
    return;
  }

  console.log('[MediaPicker] Launching image library with options:', {
    mediaType: 'mixed',
    videoQuality: 'medium',
    quality: 0.8,
    selectionLimit: 1,
  });

  launchImageLibrary(
    {
      mediaType: 'mixed',
      videoQuality: 'medium',
      quality: 0.8,
      selectionLimit: 1,
    },
    (response) => handlePickerResponse(response, onSuccess),
  );
};

export const openCamera = async (
  onSuccess: (media: MediaFile, mediaType: MediaType) => void,
) => {
  console.log('[MediaPicker] Opening camera...');

  const hasPermission = await requestCameraPermission();
  
  if (!hasPermission) {
    console.log('[MediaPicker] Camera permission denied');
    return;
  }

  console.log('[MediaPicker] Launching camera with options:', {
    mediaType: 'mixed',
    videoQuality: 'medium',
    quality: 0.8,
    saveToPhotos: true,
    durationLimit: 60,
  });

  launchCamera(
    {
      mediaType: 'mixed',
      videoQuality: 'medium',
      quality: 0.8,
      saveToPhotos: true,
      durationLimit: 60,
    },
    (response) => handlePickerResponse(response, onSuccess),
  );
};