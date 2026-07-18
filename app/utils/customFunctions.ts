import RNBlobUtil from 'react-native-blob-util';
import {Platform, PermissionsAndroid, Alert, Share} from 'react-native';
import Toast from 'react-native-toast-message';
import {translate} from '@localization';

export function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const formatMemberSince = (
  dateString: string,
  format: 'long' | 'short' = 'long',
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed
  const year = date.getFullYear();

  if (format === 'long') {
    const monthName = date.toLocaleString('default', {month: 'long'});
    return `${translate('MEMBER_SINCE')} ${monthName} ${day}, ${year}`;
  } else {
    return `${translate('MEMBER_SINCE')} : ${day}/${month}/${year}`;
  }
};

export const formatDate = (
  dateString: string,
  format: 'long' | 'short' = 'long',
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed
  const year = date.getFullYear();

  if (format === 'long') {
    const monthName = date.toLocaleString('default', {month: 'long'});
    return `${monthName} ${day}, ${year}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};

export const downloadFile = async (url: string, filename: string) => {
  try {
    const {fs, config} = RNBlobUtil;
    const isAndroid = Platform.OS === 'android';
    const path = isAndroid
      ? `${fs.dirs.DownloadDir}/${filename}`
      : `${fs.dirs.DocumentDir}/${filename}`;

    if (isAndroid) {
      const androidVersion = Platform.Version;
      if (Number(androidVersion) <= 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            translate('PERMISSION_DENIED_TITLE'),
            translate('PERMISSION_DENIED_MESSAGE'),
          );
          return;
        }
      }
      Toast.show({
        text1: translate('DOWNLOAD_STARTED_TITLE'),
        text2: translate('DOWNLOAD_STARTED_MESSAGE'),
        type: 'success',
      });

      config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          title: filename,
          path,
          notification: true,
          description: 'Downloading pdf...',
          mime: 'application/pdf',
          mediaScannable: true,
          storeLocal: true,
          storeInDownloads: true,
        },
      })
        .fetch('GET', url)
        .then(res => console.log('Downloaded to:', res.path()));
    } else {
      // const res = await config({fileCache: true, path}).fetch('GET', url);
      const res = await config({fileCache: true, path: path}).fetch('GET', url);

      const localFilePath = 'file://' + res.path();

      // await Share.open({
      //   url: localFilePath,
      //   type: 'application/pdf', // adjust if not always PDF
      //   failOnCancel: false,
      // });

      console.log('✅ File downloaded and shared from:', res.path());

      await Share.share({
        url: localFilePath,
      });
    }
  } catch (err) {
    console.error('Download error:', err);
  }
};

export const generateChatFilename = (
  prefix: string = 'chat',
  extension: string = 'pdf',
): string => {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
    now.getSeconds(),
  )}`;

  return `${prefix}_${date}_${time}.${extension}`;
};

export const normalizeName = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, '$1_$2') // convert camelCase → snake_case
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
