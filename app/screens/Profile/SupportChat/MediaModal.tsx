import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    Image,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import Video, { VideoRef, OnLoadData, OnProgressData, OnBufferData } from 'react-native-video';
import { COLORS, SPACING, scaleSize } from '@theme';

type MediaModalProps = {
    visible: boolean;
    url: string;
    type: 'image' | 'video' | null;
    onClose: () => void;
};

const MediaModal = ({ visible, url, type, onClose }: MediaModalProps) => {
    const videoRef = useRef<VideoRef>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!visible) {
            // Reset states when modal closes
            setIsLoading(false);
            setIsBuffering(false);
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.seek(0);
            }
        } else if (type === 'video') {
            // Show loader when modal opens with video
            setIsLoading(true);
            setIsBuffering(false);
            setIsPlaying(false);
        }
    }, [visible, type]);

    if (!url || !type) return null;

    // Video started loading
    const handleLoadStart = () => {
        console.log('📹 Video: Load started');
        setIsLoading(true);
        setIsPlaying(false);
    };

    // Video metadata loaded
    const handleLoad = (data: OnLoadData) => {
        console.log('📹 Video: Loaded - Duration:', data.duration);
        // Keep loader until video is ready to display
    };

    // Video is ready to play
    const handleReadyForDisplay = () => {
        console.log('📹 Video: Ready to display');
        setIsLoading(false);
        setIsPlaying(true);
    };

    // Buffering state changed
    const handleBuffer = (data: OnBufferData) => {
        console.log('📹 Video: Buffering:', data.isBuffering);
        if (data.isBuffering) {
            setIsBuffering(true);
        } else {
            setIsBuffering(false);
        }
    };

    // Video playing progress
    const handleProgress = (data: OnProgressData) => {
        // Once video starts playing, hide initial loader
        if (data.currentTime > 0 && isLoading) {
            setIsLoading(false);
            setIsPlaying(true);
        }
        // Keep playing state updated
        if (data.currentTime > 0 && !isPlaying) {
            setIsPlaying(true);
        }
    };

    // Video error
    const handleError = (error: any) => {
        console.error('📹 Video: Error:', error);
        setIsLoading(false);
        setIsBuffering(false);
    };

    // Show loader if loading initially or buffering during playback
    const shouldShowLoader = isLoading || (isBuffering && isPlaying);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable
                    style={styles.modalContentContainer}
                    onPress={e => e.stopPropagation()}>
                    <Pressable style={styles.modalCloseBtn} onPress={onClose}>
                        <Text style={styles.modalCloseBtnText}>✕</Text>
                    </Pressable>

                    {type === 'image' && (
                        <Image
                            source={{ uri: url }}
                            style={styles.modalImage}
                            resizeMode="contain"
                        />
                    )}

                    {type === 'video' && (
                        <View style={styles.modalVideo}>
                            {/* Always show loader on top when loading/buffering */}
                            {shouldShowLoader && (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator
                                        size="large"
                                        color={COLORS.WHITE_COLOR}
                                    />
                                    <Text style={styles.loadingText}>
                                        {isLoading ? 'Loading video...' : 'Buffering...'}
                                    </Text>
                                </View>
                            )}

                            <Video
                                ref={videoRef}
                                source={{ uri: url }}
                                style={styles.videoPlayer}
                                resizeMode="contain"
                                controls={true}
                                paused={false}  // Always play when modal is open
                                repeat={false}
                                muted={false}
                                volume={1.0}
                                rate={1.0}
                                // Important: Video should start playing automatically
                                playWhenInactive={false}
                                playInBackground={false}
                                // iOS optimizations
                                ignoreSilentSwitch="ignore"
                                automaticallyWaitsToMinimizeStalling={false}
                                preventsDisplaySleepDuringVideoPlayback={true}
                                allowsExternalPlayback={false}
                                // pictureInPicture={false}
                                // Buffer config optimized for continuous playback
                                bufferConfig={{
                                    minBufferMs: Platform.OS === 'ios' ? 1000 : 1500,
                                    maxBufferMs: Platform.OS === 'ios' ? 5000 : 8000,
                                    bufferForPlaybackMs: 500,  // Start after 0.5s
                                    bufferForPlaybackAfterRebufferMs: 1000,  // Resume after 1s
                                }}
                                // Full quality
                                maxBitRate={0}
                                // Frequent updates to track state
                                progressUpdateInterval={200}
                                // Event handlers
                                onLoadStart={handleLoadStart}
                                onLoad={handleLoad}
                                onReadyForDisplay={handleReadyForDisplay}
                                onBuffer={handleBuffer}
                                onProgress={handleProgress}
                                onError={handleError}
                            />
                        </View>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
        marginHorizontal: SPACING.m,
    },
    modalVideo: {
        width: '100%',
        height: Platform.OS === 'ios' ? '40%' : '35%',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? scaleSize(50) : scaleSize(40),
        right: SPACING.m,
        width: scaleSize(40),
        height: scaleSize(40),
        borderRadius: scaleSize(20),
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        elevation: 5,
    },
    modalCloseBtnText: {
        color: '#FFF',
        fontSize: scaleSize(20),
        fontWeight: 'bold',
        lineHeight: scaleSize(20),
    },
    loaderContainer: {
        position: 'absolute',
        zIndex: 998,
        elevation: 5,  // Android z-index fix - ensures loader shows on top
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: scaleSize(12),
        paddingVertical: scaleSize(20),
        paddingHorizontal: scaleSize(30),
    },
    loadingText: {
        color: COLORS.WHITE_COLOR,
        marginTop: scaleSize(10),
        fontSize: scaleSize(14),
        fontWeight: '500',
    },
});

export default MediaModal;
