import AudioRecord from 'react-native-audio-record';
import {requestMicrophonePermission} from './permissions';

export interface AudioRecordingResult {
  uri: string;
  type: string;
  fileName: string;
}

const audioOptions = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  wavFile: 'recording.wav',
};

let isInitialized = false;

export const initAudioRecorder = () => {
  if (!isInitialized) {
    console.log('[AudioRecorder] Initializing audio recorder with options:', audioOptions);
    AudioRecord.init(audioOptions);
    AudioRecord.on('data', data => {
      console.log('[AudioRecorder] Audio data chunk received, length:', data.length);
    });
    
    isInitialized = true;
    console.log('[AudioRecorder] Initialized successfully');
  }
};

export const startRecording = async (): Promise<boolean> => {
  console.log('[AudioRecorder] Starting recording...');

  const hasPermission = await requestMicrophonePermission();
  
  if (!hasPermission) {
    console.log('[AudioRecorder] Microphone permission denied');
    return false;
  }

  try {
    initAudioRecorder();
    
    console.log('[AudioRecorder] Calling AudioRecord.start()');
    await AudioRecord.start();
    
    console.log('[AudioRecorder] Recording started successfully');
    return true;
  } catch (err) {
    console.error('[AudioRecorder] Error starting recording:', err);
    return false;
  }
};

export const stopRecording = async (): Promise<AudioRecordingResult | null> => {
  console.log('[AudioRecorder] Stopping recording...');

  try {
    const filePath = await AudioRecord.stop();
    
    console.log('[AudioRecorder] Recording stopped');
    console.log('[AudioRecorder] File path:', filePath);

    if (filePath) {
      const result: AudioRecordingResult = {
        uri: `file://${filePath}`,
        type: 'audio/wav',
        fileName: 'recording.wav',
      };
      
      console.log('[AudioRecorder] Recording result:', JSON.stringify(result, null, 2));
      return result;
    } else {
      console.log('[AudioRecorder] No file path returned');
      return null;
    }
  } catch (err) {
    console.error('[AudioRecorder] Error stopping recording:', err);
    return null;
  }
};

export const cleanupAudioRecorder = () => {
  console.log('[AudioRecorder] Cleaning up...');
  try {
    AudioRecord.stop();
    console.log('[AudioRecorder] Cleanup completed');
  } catch (err) {
    console.error('[AudioRecorder] Error during cleanup:', err);
  }
};