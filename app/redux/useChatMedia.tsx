// hooks/useMediaHooks.ts
import {useState, useCallback, useRef, useEffect} from 'react';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import AudioRecord from 'react-native-audio-record';

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
  startRecording: (options?: AudioRecorderOptions) => void;
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
        quality: 0.8, // Compress slightly for performance
        includeBase64: false,
        ...options,
      };

      launchImageLibrary(defaultOptions, response => {
        console.log(
          '📁 Gallery Picker Response:',
          JSON.stringify(response, null, 2),
        );

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

          console.log('✅ Selected Media:', JSON.stringify(mediaData, null, 2));
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
    const defaultOptions = {
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'recording.wav',
    };

    AudioRecord.init(defaultOptions);
    console.log('🎙️ Audio Recorder Initialized');

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isRecordingRef.current) {
        AudioRecord.stop();
      }
    };
  }, []);

  const startRecording = useCallback((options?: AudioRecorderOptions) => {
    try {
      setError(null);
      setAudioPath(null);
      setRecordingDuration(0);

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

      AudioRecord.start();
      isRecordingRef.current = true;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
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
