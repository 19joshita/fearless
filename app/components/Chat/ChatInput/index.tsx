import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, FONT_FAMILY, scaleSize} from '@theme';
import {
  ICON_INPUT_RADIUS,
  ICON_SEND,
  ICON_MICROPHONE,
  ICON_CAMERA,
  ICON_PLAY,
  ICON_CLOSE,
} from '@assets/icons';
import {AppImage} from '@global-components';
import {useAppSelector} from '@redux/reduxHook';
import {useText} from '@localization';
import Video from 'react-native-video';

interface ChatInputProps {
  onPress: (text: string) => void;
  isDisabled?: boolean;
  showImage?: boolean;
  openGallery?: () => void;
  handleAudio?: () => void;
  startRecording?: () => void;
  stopRecording?: () => void;
  handleUploadFile?: (
    uri: string,
    type: string,
    name: string,
  ) => Promise<string | null>;
  uploadedUrl?: string | null;
  uploadedType?: 'image' | 'video' | 'audio' | null;
  isUploading?: boolean;
  isRecording?: boolean;
  onRemoveMedia?: () => void;
  showInputIcon?: boolean;
}

const ChatInput = ({
  onPress,
  isDisabled = false,
  showImage = false,
  openGallery,
  handleAudio,
  uploadedUrl,
  uploadedType,
  isUploading,
  isRecording,
  onRemoveMedia,
  showInputIcon = false,
}: ChatInputProps) => {
  const {TEXT} = useText();
  const Profile = useAppSelector(state => state.app?.userInfo);
  const [text, setText] = useState<string>('');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const hasText = text.trim().length > 0;
  const isSendDisabled = isDisabled || (!hasText && !uploadedUrl);
  const isMediaDisabled = isUploading || isRecording;

  // Stop audio playback if the uploaded media is removed
  useEffect(() => {
    if (!uploadedUrl) {
      setIsAudioPlaying(false);
    }
  }, [uploadedUrl]);

  const handleSend = () => {
    if (isSendDisabled) return;
    onPress(text.trim());
    setText('');
  };

  const toggleAudioPlay = () => {
    setIsAudioPlaying(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {showImage && (
        <AppImage imageContainerStyle={styles.avatar} uri={Profile?.image} />
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.bubblePointer}>
          <ICON_INPUT_RADIUS />
        </View>
        <View style={styles.bubble}>
          {/* --- 1. Recording UI --- */}
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
              {/* Stop button calls handleAudio which triggers stopRecording in parent */}
              <TouchableOpacity onPress={handleAudio}>
                <ICON_CLOSE width={scaleSize(18)} height={scaleSize(18)} />
              </TouchableOpacity>
            </View>
          ) : uploadedType === 'audio' ? (
            <View style={styles.audioContainer}>
              {isUploading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.SECONDARY_COLOR}
                />
              ) : (
                <TouchableOpacity
                  onPress={toggleAudioPlay}
                  style={styles.playBtn}>
                  {isAudioPlaying ? (
                    <ICON_CLOSE width={scaleSize(16)} height={scaleSize(16)} />
                  ) : (
                    <ICON_PLAY width={scaleSize(20)} height={scaleSize(20)} />
                  )}
                </TouchableOpacity>
              )}
              <View style={styles.audioWaveContainer}>
                <View style={styles.waveform}>
                  {[...Array(20)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.waveBar,
                        {
                          height: Math.random() * 16 + 6,
                          backgroundColor: isAudioPlaying
                            ? COLORS.SECONDARY_COLOR
                            : COLORS.GRAY_TEXT_COLOR,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.audioLabel}>
                  {isUploading ? 'Uploading Audio...' : 'Audio'}
                </Text>
              </View>

              {!isUploading && (
                <TouchableOpacity
                  onPress={onRemoveMedia}
                  style={styles.closeMediaBtn}>
                  <ICON_CLOSE width={scaleSize(14)} height={scaleSize(14)} />
                </TouchableOpacity>
              )}

              {/* Hidden Video component to actually play the audio (prevents TS errors) */}
              {!isUploading && uploadedUrl && (
                <Video
                  source={{uri: uploadedUrl}}
                  paused={!isAudioPlaying}
                  repeat={true}
                  style={styles.hiddenAudioPlayer}
                />
              )}
            </View>
          ) : (
            <>
              {/* Loader while Image/Video is uploading */}
              {(uploadedType === 'image' || uploadedType === 'video') &&
              isUploading &&
              !uploadedUrl ? (
                <View style={styles.mediaPreviewContainer}>
                  <View style={styles.loaderPlaceholder}>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.SECONDARY_COLOR}
                    />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                </View>
              ) : null}

              {/* Actual Image/Video Preview after successful upload */}
              {uploadedUrl &&
              (uploadedType === 'image' || uploadedType === 'video') ? (
                <View style={styles.mediaPreviewContainer}>
                  {uploadedType === 'video' ? (
                    <Video
                      source={{uri: uploadedUrl}}
                      style={styles.mediaPreview}
                      resizeMode="cover"
                      paused={true}
                      muted={true}
                      repeat={false}
                    />
                  ) : (
                    <AppImage
                      uri={uploadedUrl}
                      customStyle={styles.mediaPreview}
                    />
                  )}

                  {uploadedType === 'video' && (
                    <View style={styles.videoPlayOverlay}>
                      <ICON_PLAY width={scaleSize(16)} height={scaleSize(16)} />
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={onRemoveMedia}
                    style={styles.closeMediaBtn}>
                    <ICON_CLOSE width={scaleSize(12)} height={scaleSize(12)} />
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.inputRow}>
                <TextInput
                  placeholder={TEXT.ASK_A_QUESTION}
                  placeholderTextColor={COLORS.BODY_TEXT_COLOR}
                  value={text}
                  onChangeText={setText}
                  allowFontScaling={false}
                  style={[styles.textInput, {color: COLORS.BODY_TEXT_COLOR}]}
                />
                {showInputIcon && (
                  <>
                    <TouchableOpacity
                      onPress={openGallery}
                      style={[
                        styles.iconBtn,
                        isMediaDisabled && {opacity: 0.4},
                      ]}
                      disabled={isMediaDisabled}>
                      <ICON_CAMERA
                        width={scaleSize(20)}
                        height={scaleSize(20)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleAudio}
                      style={[
                        styles.iconBtn,
                        isMediaDisabled && {opacity: 0.4},
                      ]}
                      disabled={isMediaDisabled}>
                      <ICON_MICROPHONE
                        width={scaleSize(20)}
                        height={scaleSize(20)}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        disabled={isSendDisabled}
        onPress={handleSend}
        style={[
          styles.sendBtn,
          {
            backgroundColor: isSendDisabled
              ? COLORS.TABS_BG
              : COLORS.SECONDARY_COLOR,
            opacity: isSendDisabled ? 0.5 : 1,
          },
        ]}>
        <ICON_SEND width={scaleSize(16)} height={scaleSize(16)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleSize(10),
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: scaleSize(8),
  },
  avatar: {
    height: scaleSize(32),
    width: scaleSize(32),
    borderRadius: scaleSize(99),
  },
  inputWrapper: {flex: 1, position: 'relative' as const},
  bubblePointer: {
    position: 'absolute' as const,
    left: -5,
    bottom: 6,
    zIndex: 1,
  },
  bubble: {
    borderRadius: scaleSize(8),
    backgroundColor: COLORS.TABS_BG,
    paddingVertical: scaleSize(8),
    paddingLeft: scaleSize(14),
    paddingRight: scaleSize(8),
    minHeight: scaleSize(38),
  },
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  textInput: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.Regular,
    flex: 1,
    paddingVertical: 0,
    height: scaleSize(20),
  },
  iconBtn: {
    marginLeft: scaleSize(10),
    padding: scaleSize(4),
  },
  sendBtn: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: scaleSize(38),
    width: scaleSize(38),
    borderRadius: scaleSize(19),
  },
  mediaPreviewContainer: {
    position: 'relative' as const,
    width: scaleSize(70),
    height: scaleSize(70),
    marginBottom: scaleSize(8),
    borderRadius: scaleSize(8),
    overflow: 'hidden' as const,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: scaleSize(8),
  },
  videoPlayOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loaderPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: scaleSize(8),
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: scaleSize(4),
  },
  uploadingText: {
    fontSize: scaleSize(10),
    color: COLORS.GRAY_TEXT_COLOR,
    fontFamily: FONT_FAMILY.Regular,
  },
  closeMediaBtn: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: scaleSize(10),
    padding: 2,
    zIndex: 2,
  },
  audioContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: scaleSize(10),
    paddingVertical: scaleSize(4),
  },
  playBtn: {
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(16),
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  audioWaveContainer: {
    flex: 1,
    gap: scaleSize(4),
  },
  waveform: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    height: scaleSize(24),
    gap: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  audioLabel: {
    fontSize: scaleSize(10),
    color: COLORS.GRAY_TEXT_COLOR,
    fontFamily: FONT_FAMILY.Regular,
  },
  hiddenAudioPlayer: {
    width: 0,
    height: 0,
    position: 'absolute' as const,
    top: -100,
    left: -100,
    opacity: 0,
  },
  recordingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: scaleSize(10),
    paddingVertical: scaleSize(4),
  },
  recordingDot: {
    width: scaleSize(10),
    height: scaleSize(10),
    borderRadius: scaleSize(5),
    backgroundColor: 'red',
  },
  recordingText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.BODY_TEXT_COLOR,
    fontFamily: FONT_FAMILY.Medium,
  },
});

export default ChatInput;
