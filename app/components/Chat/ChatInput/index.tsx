import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Image,
  ImageSourcePropType,
  Animated,
  Easing,
} from 'react-native';
import Video from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle} from 'react-native-svg';

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

interface ChatInputProps {
  onPress: (text: string) => void;

  isDisabled?: boolean;
  showImage?: boolean;
  showInputIcon?: boolean;

  openGallery?: () => void;
  capturePhoto?: () => void;
  captureVideo?: () => void;

  handleAudio?: () => void;
  startRecording?: () => void;
  stopRecording?: () => void;
  isPickerLoading: boolean;
  handleUploadFile?: (
    uri: string,
    type: string,
    name: string,
  ) => Promise<string | null>;

  uploadedUrl?: string | null;
  uploadedThumbnail?: string | null;
  uploadedType?: 'image' | 'video' | 'audio' | null;

  isUploading?: boolean;
  isRecording?: boolean;

  uploadProgress?: number;
  uploadError?: string | null;

  uploadedDuration?: number;

  onRetryUpload?: () => void;
  onRemoveMedia?: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ChatInput = ({
  onPress,

  isDisabled = false,
  showImage = false,
  showInputIcon = false,

  openGallery,
  capturePhoto,
  captureVideo,

  handleAudio,

  uploadedUrl,
  uploadedThumbnail,
  uploadedType,

  isUploading = false,
  isRecording = false,

  uploadProgress = 0,
  uploadError = null,

  onRetryUpload,
  onRemoveMedia,
  isPickerLoading,
}: ChatInputProps) => {
  const {TEXT} = useText();
  const {bottom} = useSafeAreaInsets();

  const Profile = useAppSelector(state => state.app.userInfo);

  const [text, setText] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Spin animation ref for continuous rotation after 100%
  const spinAnim = useRef(new Animated.Value(0)).current;

  /**
   * -------------------------------------------------------
   * BASIC STATE
   * -------------------------------------------------------
   */

  const hasText = text.trim().length > 0;

  const hasMedia =
    !!uploadedUrl && uploadedType !== null && uploadedType !== undefined;

  // Disable send while picking, uploading, or if empty
  const isSendDisabled =
    isDisabled || (!hasText && !hasMedia) || isUploading || isPickerLoading;

  // Disable media buttons while picking, uploading, or recording
  const isMediaDisabled = isUploading || isRecording || isPickerLoading;

  /**
   * -------------------------------------------------------
   * RESET AUDIO
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!uploadedUrl) {
      setIsAudioPlaying(false);
    }
  }, [uploadedUrl]);

  /**
   * -------------------------------------------------------
   * SEND
   * -------------------------------------------------------
   */

  const handleSend = useCallback(() => {
    if (isSendDisabled) {
      return;
    }
    onPress(text.trim());
    setText('');
  }, [isSendDisabled, onPress, text]);

  /**
   * -------------------------------------------------------
   * AUDIO
   * -------------------------------------------------------
   */

  const toggleAudioPlay = useCallback(() => {
    setIsAudioPlaying(prev => !prev);
  }, []);

  const previewUri = useMemo(() => {
    if (!uploadedUrl) {
      return null;
    }

    if (uploadedType === 'image') {
      return uploadedUrl;
    }

    if (uploadedType === 'video' && !isUploading && uploadedThumbnail) {
      return uploadedThumbnail;
    }

    return uploadedUrl;
  }, [uploadedUrl, uploadedThumbnail, uploadedType, isUploading]);

  const shouldRenderImage = useMemo(() => {
    if (uploadedType === 'image') {
      return true;
    }

    if (uploadedType === 'video' && !isUploading && uploadedThumbnail) {
      return true;
    }

    return false;
  }, [uploadedType, uploadedThumbnail, isUploading]);

  const shouldRenderVideo = useMemo(() => {
    return uploadedType === 'video' && !shouldRenderImage;
  }, [uploadedType, shouldRenderImage]);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  useEffect(() => {
    setThumbnailFailed(false);
  }, [uploadedThumbnail, uploadedUrl]);

  /**
   * -------------------------------------------------------
   * ANIMATED PROGRESS CIRCLE VARIABLES
   * -------------------------------------------------------
   */
  const circleSize = scaleSize(36);
  const circleStroke = scaleSize(3);
  const circleRadius = (circleSize - circleStroke) / 2;
  const circleCircumference = 2 * Math.PI * circleRadius;

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circleCircumference, 0],
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: uploadProgress,
      duration: 180,
      easing: Easing.linear,
      useNativeDriver: false, // Required for SVG strokeDashoffset
    }).start();
  }, [uploadProgress]);

  /**
   * -------------------------------------------------------
   * CONTINUOUS SPIN ANIMATION LOGIC
   * Starts exactly at 100% and keeps spinning until isUploading turns false
   * -------------------------------------------------------
   */
  useEffect(() => {
    if (uploadProgress >= 100 && isUploading) {
      spinAnim.setValue(0);
      const spinLoop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000, // 1 second per complete round
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      spinLoop.start();
      return () => spinLoop.stop();
    } else {
      spinAnim.setValue(0);
    }
  }, [uploadProgress, isUploading]);

  // -90deg starts the fill from the top. 270deg is exactly one 360deg rotation from -90deg.
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '270deg'],
  });

  const renderImagePreview = shouldRenderImage && !thumbnailFailed;
  const renderVideoPreview = uploadedType === 'video' && !renderImagePreview;

  // ===========================
  // JSX STARTS FROM PART 2
  // ===========================
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
            {/* ======================================================
                RECORDING UI
            ====================================================== */}

            {isRecording ? (
              <View style={styles.recordingContainer}>
                <View style={styles.recordingDot} />

                <Text style={styles.recordingText}>Recording...</Text>

                <TouchableOpacity activeOpacity={0.8} onPress={handleAudio}>
                  <ICON_PAUSE width={scaleSize(18)} height={scaleSize(18)} />
                </TouchableOpacity>
              </View>
            ) : uploadedType === 'audio' ? (
              /* ======================================================
                  AUDIO PREVIEW
              ====================================================== */
              <View style={styles.audioContainer}>
                {isUploading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.SECONDARY_COLOR}
                  />
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={toggleAudioPlay}
                    style={styles.playBtn}>
                    {isAudioPlaying ? (
                      <ICON_CLOSE
                        width={scaleSize(15)}
                        height={scaleSize(15)}
                      />
                    ) : (
                      <ICON_PLAY width={scaleSize(18)} height={scaleSize(18)} />
                    )}
                  </TouchableOpacity>
                )}

                <View style={styles.audioWaveContainer}>
                  <View style={styles.waveform}>
                    {Array.from({length: 22}).map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.waveBar,
                          {
                            height: 6 + ((index * 9) % 18),

                            backgroundColor: isAudioPlaying
                              ? COLORS.SECONDARY_COLOR
                              : COLORS.GRAY_TEXT_COLOR,
                          },
                        ]}
                      />
                    ))}
                  </View>

                  <Text style={styles.audioLabel}>
                    {isUploading ? 'Uploading...' : 'Audio Message'}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onRemoveMedia}
                  style={styles.closeMediaBtn}>
                  <ICON_CLOSE width={scaleSize(14)} height={scaleSize(14)} />
                </TouchableOpacity>

                {!isUploading && uploadedUrl && (
                  <Video
                    source={{
                      uri: uploadedUrl,
                    }}
                    paused={!isAudioPlaying}
                    repeat
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="ignore"
                    style={styles.hiddenAudioPlayer}
                  />
                )}
              </View>
            ) : (
              <>
                {/* ======================================================
                    UNIFIED MEDIA CONTAINER
                    Shows for both Picker Loading and Uploaded Media
                ====================================================== */}
                {(isPickerLoading || hasMedia) && (
                  <View
                    style={[
                      styles.mediaPreviewContainer,
                      styles.mediaContainerShadow,
                    ]}>
                    {/* ---------- PICKER LOADING OVERLAY ---------- */}
                    {isPickerLoading && !hasMedia && (
                      <View style={styles.pickerLoadingOverlay}>
                        <ActivityIndicator
                          size="small"
                          color={COLORS.WHITE_COLOR}
                        />
                      </View>
                    )}

                    {/* ---------- IMAGE ---------- */}

                    {renderImagePreview && previewUri && (
                      <Image
                        source={{uri: previewUri}}
                        style={styles.mediaPreview}
                        resizeMode="cover"
                        fadeDuration={0}
                        onError={() => {
                          if (uploadedType === 'video') {
                            setThumbnailFailed(true);
                          }
                        }}
                      />
                    )}

                    {/* ---------- VIDEO ---------- */}

                    {renderVideoPreview && uploadedUrl && (
                      <Video
                        source={{uri: uploadedUrl}}
                        style={styles.mediaPreview}
                        resizeMode="cover"
                        paused
                        muted
                        controls={false}
                        repeat={false}
                        playWhenInactive={false}
                        playInBackground={false}
                        ignoreSilentSwitch="ignore"
                      />
                    )}

                    {/* =====================================================
                        WHATSAPP STYLE CIRCULAR GREEN PROGRESS
                        + Continuous Spin after 100%
                    ====================================================== */}

                    {isUploading && hasMedia && (
                      <View style={styles.progressOverlay}>
                        <Animated.View style={{transform: [{rotate: spin}]}}>
                          <Svg width={circleSize} height={circleSize}>
                            {/* Background Track Circle */}
                            <Circle
                              cx={circleSize / 2}
                              cy={circleSize / 2}
                              r={circleRadius}
                              stroke="rgba(0, 0, 0, 0.2)"
                              strokeWidth={circleStroke}
                              fill="transparent"
                            />
                            {/* Animated Progress Circle */}
                            <AnimatedCircle
                              cx={circleSize / 2}
                              cy={circleSize / 2}
                              r={circleRadius}
                              stroke="#25D366"
                              strokeWidth={circleStroke}
                              fill="transparent"
                              strokeDasharray={circleCircumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          </Svg>
                        </Animated.View>
                      </View>
                    )}

                    {/* =====================================================
                        ERROR
                    ====================================================== */}

                    {!!uploadError && !isUploading && hasMedia && (
                      <View style={styles.errorOverlay}>
                        <Text style={styles.errorText}>Upload Failed</Text>

                        {onRetryUpload && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.retryButton}
                            onPress={onRetryUpload}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {/* =====================================================
                        VIDEO PLAY ICON
                    ===================================================== */}

                    {uploadedType === 'video' &&
                      !isUploading &&
                      !uploadError &&
                      hasMedia && (
                        <View style={styles.videoPlayOverlay}>
                          <ICON_PLAY
                            width={scaleSize(18)}
                            height={scaleSize(18)}
                          />
                        </View>
                      )}

                    {/* =====================================================
                        REMOVE BUTTON (Only show if media actually exists)
                    ===================================================== */}

                    {hasMedia && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.closeMediaBtn}
                        onPress={onRemoveMedia}>
                        <ICON_CLOSE
                          width={scaleSize(12)}
                          height={scaleSize(12)}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <View style={styles.inputRow}>
                  <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={TEXT.ASK_A_QUESTION}
                    placeholderTextColor={COLORS.BODY_TEXT_COLOR}
                    allowFontScaling={false}
                    multiline
                    maxLength={2000}
                    editable={!isDisabled}
                    style={[
                      styles.textInput,
                      {
                        color: COLORS.BODY_TEXT_COLOR,
                      },
                    ]}
                  />

                  {showInputIcon && (
                    <>
                      {/* Gallery */}

                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isMediaDisabled}
                        onPress={() => openGallery?.()}
                        style={[
                          styles.iconBtn,
                          isMediaDisabled && {
                            opacity: 0.4,
                          },
                        ]}>
                        <ICON_CAMERA
                          width={scaleSize(20)}
                          height={scaleSize(20)}
                        />
                      </TouchableOpacity>

                      {/* Audio */}

                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isMediaDisabled}
                        onPress={handleAudio}
                        style={[
                          styles.iconBtn,
                          isMediaDisabled && {
                            opacity: 0.4,
                          },
                        ]}>
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

        {/* ======================================================
            SEND BUTTON
        ====================================================== */}

        <TouchableOpacity
          activeOpacity={0.85}
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
          {isUploading || isPickerLoading ? (
            <ActivityIndicator size="small" color={COLORS.WHITE_COLOR} />
          ) : (
            <ICON_SEND width={scaleSize(16)} height={scaleSize(16)} />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default React.memo(ChatInput);

const styles = StyleSheet.create({
  container: {
    marginTop: scaleSize(10),
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
    backgroundColor: '#E0E0E0', // Faint bg so the loader box is visible during picker processing
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: scaleSize(8),
  },
  pickerLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Black overlay identical to video play icon
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
  errorOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: scaleSize(6),
  },
  errorText: {
    fontSize: scaleSize(10),
    color: COLORS.WHITE_COLOR,
    fontFamily: FONT_FAMILY.Medium,
  },
  retryButton: {
    backgroundColor: COLORS.WHITE_COLOR,
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(4),
    borderRadius: scaleSize(4),
  },
  retryButtonText: {
    fontSize: scaleSize(10),
    color: 'red',
    fontFamily: FONT_FAMILY.Bold,
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
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  mediaContainerShadow: {
    overflow: 'hidden',
    borderRadius: scaleSize(8),
  },
});
