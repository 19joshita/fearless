import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ActionSheetIOS,
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
  ICON_PAUSE,
} from '@assets/icons';
import {AppImage} from '@global-components';
import {useAppSelector} from '@redux/reduxHook';
import {useText} from '@localization';
import Video from 'react-native-video';
// ADDED: Import safe area to handle bottom insets universally
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ChatInputProps {
  onPress: (text: string) => void;
  isDisabled?: boolean;
  showImage?: boolean;
  openGallery?: () => void;
  capturePhoto?: () => void;
  captureVideo?: () => void;
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
  capturePhoto,
  captureVideo,
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

  // UNIVERSAL FIX: Get safe area bottom inset right inside the component
  const {bottom} = useSafeAreaInsets();

  const [text, setText] = useState<string>('');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);

  const hasText = text.trim().length > 0;
  const isSendDisabled = isDisabled || (!hasText && !uploadedUrl);
  const isMediaDisabled = isUploading || isRecording;

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

  const handleMediaAction = () => {
    if (isMediaDisabled) {
      return;
    }
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Cancel',
            'Take Photo',
            'Record Video',
            'Choose from Gallery',
          ],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            capturePhoto?.();
          } else if (buttonIndex === 2) {
            captureVideo?.();
          } else if (buttonIndex === 3) {
            openGallery?.();
          }
        },
      );
    } else {
      setShowActionSheet(true);
    }
  };

  const handleAndroidOption = (option: string) => {
    setShowActionSheet(false);
    setTimeout(() => {
      if (option === 'photo') {
        capturePhoto?.();
      } else if (option === 'video') {
        captureVideo?.();
      } else if (option === 'gallery') {
        openGallery?.();
      }
    }, 100);
  };

  return (
    <>
      <View style={[styles.container, {paddingBottom: bottom}]}>
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
                <TouchableOpacity onPress={handleAudio}>
                  <ICON_PAUSE width={scaleSize(18)} height={scaleSize(18)} />
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
                      <ICON_CLOSE
                        width={scaleSize(16)}
                        height={scaleSize(16)}
                      />
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
                        <ICON_PLAY
                          width={scaleSize(16)}
                          height={scaleSize(16)}
                        />
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={onRemoveMedia}
                      style={styles.closeMediaBtn}>
                      <ICON_CLOSE
                        width={scaleSize(12)}
                        height={scaleSize(12)}
                      />
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
                        // onPress={handleMediaAction}
                        onPress={() => handleAndroidOption('gallery')}
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

      {/* Android Action Sheet Modal */}
      {/* {Platform.OS === 'android' && (
        <Modal
          visible={showActionSheet}
          transparent
          animationType="fade"
          onRequestClose={() => setShowActionSheet(false)}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowActionSheet(false)}>
            <View style={styles.actionSheetContainer}>
              <TouchableOpacity
                style={styles.actionSheetOption}
                onPress={() => handleAndroidOption('photo')}>
                <ICON_CAMERA width={scaleSize(24)} height={scaleSize(24)} />
                <Text style={styles.actionSheetText}>Take Photo</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetDivider} />

              <TouchableOpacity
                style={styles.actionSheetOption}
                onPress={() => handleAndroidOption('video')}>
                <ICON_CAMERA width={scaleSize(24)} height={scaleSize(24)} />
                <Text style={styles.actionSheetText}>Record Video</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetDivider} />

              <TouchableOpacity
                style={styles.actionSheetOption}
                onPress={() => handleAndroidOption('gallery')}>
                <ICON_CAMERA width={scaleSize(24)} height={scaleSize(24)} />
                <Text style={styles.actionSheetText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <View style={styles.actionSheetDivider} />

              <TouchableOpacity
                style={styles.actionSheetOption}
                onPress={() => setShowActionSheet(false)}>
                <ICON_CLOSE width={scaleSize(24)} height={scaleSize(24)} />
                <Text style={[styles.actionSheetText, styles.cancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleSize(10),
    // Removed static marginVertical to prevent double-padding.
    // paddingBottom is now injected dynamically via props in the component.
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  actionSheetContainer: {
    backgroundColor: COLORS.WHITE_COLOR,
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    paddingBottom: scaleSize(20),
  },
  actionSheetOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: scaleSize(16),
    paddingHorizontal: scaleSize(20),
    gap: scaleSize(12),
  },
  actionSheetText: {
    fontSize: scaleSize(16),
    color: COLORS.BODY_TEXT_COLOR,
    fontFamily: FONT_FAMILY.Medium,
  },
  actionSheetDivider: {
    height: 1,
    backgroundColor: COLORS.TABS_BG,
    marginHorizontal: scaleSize(20),
  },
  cancelText: {
    color: COLORS.BUTTON_BORDER_COLOR,
  },
});

export default ChatInput;
