// @redux/useChatMedia.ts
import {useState, useCallback, useRef, useEffect} from 'react';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import AudioRecord from 'react-native-audio-record';
import { Platform, PermissionsAndroid } from 'react-native';

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

      const defaultOptions: ImageLibraryOptions = {
        mediaType: 'mixed',
        selectionLimit: 0,
        videoQuality: 'high',
        quality: 0.8,
        includeBase64: false,
        ...options,
      };

      launchImageLibrary(defaultOptions, response => {
        if (response.didCancel) {
          setError('User cancelled');
          setLoading(false);
          return;
        }

        if (response.errorCode) {
          setError(response.errorMessage ?? 'Unknown error');
          setLoading(false);
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const mediaData: SelectedMedia[] = response.assets.map(
            (asset: Asset) => ({
              uri: asset.uri,
              type: asset.type,
              fileName: asset.fileName,
              fileSize: asset.fileSize,
              width: asset.width,
              height: asset.height,
              duration: asset.duration,
            }),
          );

          setSelectedMedia(mediaData.length === 1 ? mediaData[0] : mediaData);
        }

        setLoading(false);
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setSelectedMedia(null);
    setError(null);
  }, []);

  return {
    selectedMedia,
    loading,
    error,
    pickMedia,
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
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isRecordingRef.current) {
        try {
          AudioRecord.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startRecording = useCallback(async (options?: AudioRecorderOptions) => {
    try {
      if (isRecordingRef.current) {
        console.warn('Already recording');
        return;
      }

      // 1. Explicit Permission Check for Android (Crucial for newer RN versions)
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'This app needs access to your microphone to record audio.',
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

      const mergedOptions = {
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: 'recording.wav',
        ...options,
      };

      // 2. Initialize (Don't rely on await due to RN Bridge race conditions)
      AudioRecord.init(mergedOptions);

      // 3. Hard delay to guarantee the native module finishes its setup queue 
      // before the start() command arrives on the native side.
      await new Promise(resolve => setTimeout(resolve, 300));

      // 4. Start recording safely
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

      console.log('📁 Audio path:', path);
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