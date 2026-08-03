import Toast from "react-native-toast-message";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
export 
const validateFileSize = (file: {
  size?: number;
  name?: string;
}): boolean => {
  if ((file.size ?? 0) > MAX_FILE_SIZE) {
    Toast.show({
      type: 'error',
      text1: 'File too large',
      text2: 'Maximum allowed size is 500 MB.',
    });

    return false;
  }

  return true;
};