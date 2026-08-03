// @redux/useChatMedia.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
  CameraOptions,
  Asset,
} from 'react-native-image-picker';
import AudioRecord from 'react-native-audio-record';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// ==================== GALLERY PICKER TYPES ====================
interface SelectedMedia {
  uri: string | undefined;
  type: string | undefined;
  fileName: string | undefined;
  fileSize: number | undefined;
  width: number | undefined;
  height: number | undefined;
  duration: number | undefined | null;
}

interface UseGalleryPickerReturn {
  selectedMedia: SelectedMedia | SelectedMedia[] | null;
  loading: boolean;
  error: string | null;
  pickMedia: (options?: Partial<ImageLibraryOptions>) => void;
  capturePhoto: () => void;
  captureVideo: () => void;
  reset: () => void;
}

// ==================== AUDIO RECORDER TYPES ====================
interface AudioRecorderOptions {
  sampleRate?: number;
  channels?: number;
  bitsPerSample?: number;
  audioSource?: number;
  wavFile?: string;
}

interface UseAudioRecorderReturn {
  audioPath: string | null;
  isRecording: boolean;
  recordingDuration: number;
  formattedDuration: string;
  error: string | null;
  startRecording: (options?: AudioRecorderOptions) => Promise<void>;
  stopRecording: () => Promise<string | null>;
  reset: () => void;
}

// ==================== GALLERY PICKER HOOK ====================
export const useGalleryPicker = (): UseGalleryPickerReturn => {
  const [selectedMedia, setSelectedMedia] = useState<
    SelectedMedia | SelectedMedia[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pickMedia = useCallback(
    (options: Partial<ImageLibraryOptions> = {}) => {
      setLoading(true);
      setError(null);

      launchImageLibrary(
        {
          mediaType: 'mixed',
          selectionLimit: 1,
          includeBase64: false,
          includeExtra: false,
          quality: 1,
          videoQuality: 'medium',

          presentationStyle: 'fullScreen',

          ...options,
        },
        response => {
          setLoading(false);

          if (response.didCancel) {
            return;
          }

          if (response.errorCode) {
            const message = response.errorMessage || 'Failed to select media';

            setError(message);
            Alert.alert('Error', message);
            return;
          }

          const asset = response.assets?.[0];

          if (!asset?.uri) {
            setError('Unable to read selected file.');
            return;
          }

          // Immediate state update
          setSelectedMedia({
            uri: asset.uri,
            type: asset.type,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            width: asset.width,
            height: asset.height,
            duration: asset.duration,
          });
        },
      );
    },
    [],
  );

  const capturePhoto = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Request camera permission on Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission denied');
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to take photos.',
          );
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Permission error:', err);
        setLoading(false);
        return;
      }
    }

    const cameraOptions: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: false,
      cameraType: 'back',
    };

    launchCamera(cameraOptions, response => {
      console.log('Camera Photo Response:', response);

      if (response.didCancel) {
        console.log('User cancelled camera');
        setLoading(false);
        return;
      }

      if (response.errorCode) {
        console.error(
          'Camera Error:',
          response.errorCode,
          response.errorMessage,
        );
        Alert.alert(
          'Camera Error',
          response.errorMessage || 'Failed to open camera',
        );
        setError(response.errorMessage ?? 'Unknown error');
        setLoading(false);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const mediaData: SelectedMedia = {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
        };
        console.log('Captured Photo:', mediaData);
        setSelectedMedia(mediaData);
      }

      setLoading(false);
    });
  }, []);

  const captureVideo = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Request camera and microphone permissions on Android
    if (Platform.OS === 'android') {
      try {
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          permissions['android.permission.CAMERA'] !==
          PermissionsAndroid.RESULTS.GRANTED ||
          permissions['android.permission.RECORD_AUDIO'] !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Camera or microphone permission denied');
          Alert.alert(
            'Permission Denied',
            'Camera and microphone permissions are required to record videos.',
          );
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Permission error:', err);
        setLoading(false);
        return;
      }
    }

    const cameraOptions: CameraOptions = {
      mediaType: 'video',
      videoQuality: 'high',
      includeBase64: false,
      saveToPhotos: false,
      cameraType: 'back',
      durationLimit: 300, // 5 minutes max
    };

    launchCamera(cameraOptions, response => {
      console.log('Camera Video Response:', response);

      if (response.didCancel) {
        console.log('User cancelled video recording');
        setLoading(false);
        return;
      }

      if (response.errorCode) {
        console.error(
          'Camera Video Error:',
          response.errorCode,
          response.errorMessage,
        );
        Alert.alert(
          'Camera Error',
          response.errorMessage || 'Failed to record video',
        );
        setError(response.errorMessage ?? 'Unknown error');
        setLoading(false);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const mediaData: SelectedMedia = {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
        };
        console.log('Recorded Video:', mediaData);
        setSelectedMedia(mediaData);
      }

      setLoading(false);
    });
  }, []);

  const reset = useCallback(() => {
    setSelectedMedia(null);
    setError(null);
  }, []);

  return {
    selectedMedia,
    loading,
    error,
    pickMedia,
    capturePhoto,
    captureVideo,
    reset,
  };
};

// ==================== AUDIO RECORDER HOOK ====================
export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    // ✅ FIX: Pre-initialize the audio recorder the moment the hook/screen loads.
    // This removes the delay completely.
    const defaultOptions = {
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'recording.wav',
    };

    try {
      AudioRecord.init(defaultOptions);
    } catch (e) {
      console.warn('Failed to pre-init audio recorder:', e);
    }

    // Cleanup when the component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isRecordingRef.current) {
        try {
          AudioRecord.stop();
        } catch (e) {
          // Silently catch
        }
      }
    };
  }, []);

  const startRecording = useCallback(async (options?: AudioRecorderOptions) => {
    try {
      if (isRecordingRef.current) {
        console.warn('Already recording');
        return;
      }

      // 1. Explicit Permission Check for Android
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message:
                'This app needs access to your microphone to record audio.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Microphone permission denied');
            return;
          }
        }
      }

      setError(null);
      setAudioPath(null);
      setRecordingDuration(0);

      // 2. Only re-initialize if you are passing custom options dynamically
      if (options) {
        const mergedOptions = {
          sampleRate: 44100,
          channels: 1,
          bitsPerSample: 16,
          audioSource: 6,
          wavFile: 'recording.wav',
          ...options,
        };
        AudioRecord.init(mergedOptions);
      }

      // 3. Start recording instantly (No setTimeout delay!)
      AudioRecord.start();

      isRecordingRef.current = true;
      setIsRecording(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to start recording:', error);
      setError(error.message);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!isRecordingRef.current) {
      console.warn('Not recording');
      return null;
    }

    try {
      const path = await AudioRecord.stop();
      isRecordingRef.current = false;
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setAudioPath(path);
      return path;
    } catch (err) {
      const error = err as Error;
      console.error('Failed to stop recording:', error);
      setError(error.message);
      setIsRecording(false);
      isRecordingRef.current = false;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return null;
    }
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formattedDuration = formatDuration(recordingDuration);

  const reset = useCallback(() => {
    setAudioPath(null);
    setError(null);
    setRecordingDuration(0);
  }, []);

  return {
    audioPath,
    isRecording,
    recordingDuration,
    formattedDuration,
    error,
    startRecording,
    stopRecording,
    reset,
  };
};
