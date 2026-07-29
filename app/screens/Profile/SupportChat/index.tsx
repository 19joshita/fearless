import React, {useRef, useState, useEffect, useCallback} from 'react';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Keyboard,
} from 'react-native';

// ADDED: Reanimated imports for fakeView keyboard handling
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import Video, {VideoRef} from 'react-native-video';
import {AppView, ChatHeader, ChatInput} from '@components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useRoute, useFocusEffect} from '@react-navigation/native';
import {useText} from '@localization';
import {useAppSelector} from '@redux/reduxHook';
import Toast from 'react-native-toast-message';

import {
  supportChatSlice,
  useDeleteMessageMutation,
  useGetSupportChatMessagesQuery,
  useSendSupportMessageMutation,
  useUploadSupportChatFileMutation,
  useMarkMessagesAsReadMutation,
} from '@redux/support-chat-slice';

import {
  IMAGE_LOGO,
  ICON_SEND_RADIUS,
  ICON_RECIEVER_RADIUS,
  ICON_DELETE,
} from '@assets/icons';

import type {Message} from 'types/support-chat';
import {AppImage} from '@global-components';
// These are already in your file and are required for the fakeView logic
import useKeyboardAnimation from './../../Home/Chat/UseKeyboardAnimation';
import useIsTabScreen from './../../Home/Chat/useIsTabScreen';
import {useAudioRecorder, useGalleryPicker} from '@redux/useChatMedia';
import {useSupportChatSocket} from './../../../hooks/useSupportChatSocket';
import {store} from '@redux/store';

// --- Types ---

type SupportChatRouteParams = {
  mode: 'user' | 'admin';
  conversationId?: string;
  userName?: string;
};

type RouteProps = RouteProp<
  {SupportChat: SupportChatRouteParams},
  'SupportChat'
>;

const SCREEN_WIDTH = Dimensions.get('window').width;

const WAVEFORM_HEIGHTS = Array.from(
  {length: 20},
  () => Math.floor(Math.random() * 16) + 6,
);

const MessageStatusTick = ({status}: {status?: string | null}) => {
  if (!status) return null;

  const isRead = status === 'read';
  const isDelivered = status === 'delivered';
  const showDouble = isDelivered || isRead;
  const tickColor = isRead ? '#34B7F1' : COLORS.GRAY_TEXT_COLOR;

  const tickMark = (
    <View
      style={{
        width: scaleSize(6),
        height: scaleSize(3.5),
        borderLeftWidth: scaleSize(1.5),
        borderBottomWidth: scaleSize(1.5),
        borderColor: tickColor,
        transform: [{rotate: '-45deg'}],
        marginBottom: scaleSize(1.5),
      }}
    />
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scaleSize(4),
        height: scaleSize(10),
      }}>
      {tickMark}
      {showDouble && (
        <View style={{marginLeft: -scaleSize(3)}}>{tickMark}</View>
      )}
    </View>
  );
};

// --- Component ---

const SupportChat = () => {
  const route = useRoute<RouteProps>();
  const {
    selectedMedia,
    pickMedia,
    capturePhoto,
    captureVideo,
    reset: resetGallery,
  } = useGalleryPicker();
  const [deleteSupportMessage] = useDeleteMessageMutation();
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {
    audioPath,
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    reset: resetAudio,
  } = useAudioRecorder();

  const {mode = 'user', conversationId, userName} = route.params ?? {};
  const {TEXT} = useText();
  const {bottom} = useSafeAreaInsets();
  const profile = useAppSelector(state => state.app?.userInfo);
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<Message[]>([]);
  const processedSocketIdsRef = useRef<Set<number>>(new Set());

  const isPaginating = useRef(false);

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedType, setUploadedType] = useState<
    'image' | 'video' | 'audio' | null
  >(null);
  const [uploadedDuration, setUploadedDuration] = useState<number | null>(null);

  const [playingAudioId, setPlayingAudioId] = useState<number | string | null>(
    null,
  );
  const [audioLoadingId, setAudioLoadingId] = useState<number | string | null>(
    null,
  );

  const [mediaModal, setMediaModal] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);
  const [isModalVideoLoading, setIsModalVideoLoading] = useState(false);
  const audioPlayerRef = useRef<VideoRef>(null);

  const {messages: socketMessages, presenceMap} = useSupportChatSocket(
    conversationId ?? null,
  );

  const [sendMessage] = useSendSupportMessageMutation();
  const [uploadFile, {isLoading: isUploading}] =
    useUploadSupportChatFileMutation();

  // ==========================================
  // PAGINATION STATE
  // ==========================================
  const [limit, setLimit] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: messagesData,
    isFetching: isApiFetching,
    refetch,
  } = useGetSupportChatMessagesQuery(
    {conversationId: conversationId ?? '', page: 1, limit},
    {skip: !conversationId},
  );

  const participants = messagesData?.data?.participants ?? [];
  const senderType = mode === 'admin' ? 'admin' : 'user';
  const otherParticipant = participants.find(p => p.role !== senderType);

  const isOtherUserOnline = otherParticipant?.id
    ? presenceMap[otherParticipant.id] === 'online'
    : false;

  const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const hasMore = messagesData?.data?.pagination?.has_next_page ?? false;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleMarkAsRead = useCallback(
    async (messageIds: number[]) => {
      if (!conversationId || messageIds.length === 0) return;
      setMessages(prev =>
        prev.map(msg =>
          messageIds.includes(msg.id) && msg.sender_type !== senderType
            ? {...msg, status: 'read' as const}
            : msg,
        ),
      );

      try {
        await markMessagesAsRead({
          conversationId: conversationId,
          message_ids: messageIds,
        }).unwrap();
      } catch (error) {
        console.log('Mark as read error:', error);
        setMessages(prev =>
          prev.map(msg =>
            messageIds.includes(msg.id) && msg.sender_type !== senderType
              ? {...msg, status: 'delivered' as const}
              : msg,
          ),
        );
      }
    },
    [conversationId, markMessagesAsRead, senderType],
  );

  useFocusEffect(
    useCallback(() => {
      if (conversationId) {
        refetch();

        const timer = setTimeout(() => {
          const currentMessages = messagesRef.current;
          const unreadIds = currentMessages
            .filter(m => m.sender_type !== senderType && m.status !== 'read')
            .map(m => m.id);
          if (unreadIds.length > 0) {
            handleMarkAsRead(unreadIds);
          }
        }, 800);
        return () => clearTimeout(timer);
      }
      return () => {};
    }, [conversationId, handleMarkAsRead, senderType, refetch]),
  );

  useEffect(() => {
    if (!messagesData?.data?.messages || !conversationId) return;
    const unreadIds = messagesData.data.messages
      .filter(m => m.sender_type !== senderType && m.status !== 'read')
      .map(m => m.id);
    if (unreadIds.length > 0) {
      handleMarkAsRead(unreadIds);
    }
  }, [messagesData, conversationId, senderType, handleMarkAsRead]);

  useEffect(() => {
    processedSocketIdsRef.current = new Set();
    setMessages([]);
    setLimit(20);
    isPaginating.current = false;
    setIsLoadingMore(false);

    if (conversationId) {
      store.dispatch(
        supportChatSlice.util.invalidateTags([
          {type: 'SupportChat', id: `Messages-${conversationId}`},
        ]),
      );
    }
  }, [conversationId]);

  const handleDeleteMessage = async (messageId: number) => {
    setMenuVisibleId(null);
    try {
      await deleteSupportMessage({
        messageId,
        conversationId: Number(conversationId),
      }).unwrap();
      setDeletedIds(new Set());
      setMessages([]);
      setLimit(20);
      refetch();
      Toast.show({
        type: 'success',
        text1: TEXT.MESSAGE_DELETED,
      });
    } catch (error: any) {}
  };

  const handleUploadFile = useCallback(
    async (uri: string, type: string, name: string): Promise<string | null> => {
      if (!uri) {
        console.log('No URI provided for upload');
        return null;
      }
      console.log('Starting upload:', {uri, type, name});

      const formData = new FormData();
      formData.append('file', {
        uri,
        type,
        name: name || 'media',
      } as unknown as Blob);

      try {
        const response = await uploadFile(formData).unwrap();
        console.log('Upload successful:', response);
        setUploadedUrl(response.url);
        return response.url;
      } catch (error: any) {
        console.error('Upload failed:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to upload file',
          text2: error?.data?.message || 'Please try again',
        });
        setUploadedType(null);
        setUploadedDuration(null);
        return null;
      }
    },
    [uploadFile],
  );

  const handleRemoveMedia = useCallback(() => {
    setUploadedUrl(null);
    setUploadedType(null);
    setUploadedDuration(null);
  }, []);

  useEffect(() => {
    if (!selectedMedia) return;

    const media = Array.isArray(selectedMedia)
      ? selectedMedia[0]
      : selectedMedia;

    if (!media?.uri) {
      console.log('No media URI found');
      return;
    }

    console.log('Processing selected media:', media);

    const mimeType = media.type ?? 'image/jpeg';
    const fileName =
      media.fileName ?? `media.${mimeType.split('/')[1] ?? 'jpg'}`;

    // Determine if it's video, image, or audio
    let mediaType: 'video' | 'image' | 'audio' = 'image';
    if (mimeType.startsWith('video/')) {
      mediaType = 'video';
    } else if (mimeType.startsWith('audio/')) {
      mediaType = 'audio';
    }

    setUploadedType(mediaType);

    // Handle duration - iOS returns duration in seconds, sometimes as decimal
    const duration = media.duration
      ? media.duration > 1000
        ? Math.round(media.duration / 1000) 
        : Math.round(media.duration) 
      : null;

    setUploadedDuration(duration);

    console.log('Uploading:', {
      uri: media.uri,
      type: mimeType,
      fileName,
      mediaType,
      duration,
      fileSize: media.fileSize,
    });

    handleUploadFile(media.uri, mimeType, fileName);
    resetGallery();
  }, [selectedMedia, handleUploadFile, resetGallery]);

  useEffect(() => {
    if (!audioPath) return;
    setUploadedType('audio');
    setUploadedDuration(recordingDuration);
    const formattedUri = audioPath.startsWith('file://')
      ? audioPath
      : `file://${audioPath}`;
    handleUploadFile(formattedUri, 'audio/wav', 'recording.wav');
    resetAudio();
  }, [audioPath, handleUploadFile, resetAudio, recordingDuration]);

  useEffect(() => {
    if (isRefreshing && !isApiFetching) {
      setIsRefreshing(false);
    }
  }, [isApiFetching, isRefreshing]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isPaginating.current || isLoadingMore) return;

      const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
      const distanceFromTop =
        contentSize.height - layoutMeasurement.height - contentOffset.y;

      if (distanceFromTop <= 50 && hasMore && !isApiFetching && !isRefreshing) {
        isPaginating.current = true;
        setIsLoadingMore(true);
        setLimit(prev => prev + 20);
      }
    },
    [hasMore, isApiFetching, isRefreshing, isLoadingMore],
  );

  useEffect(() => {
    if (!messagesData?.data?.messages) return;

    const apiMessages = messagesData.data.messages;

    setMessages(prev => {
      const tempMessages = prev.filter(m => m.id > 1000000000000);

      if (isPaginating.current) {
        isPaginating.current = false;
        const prevIds = new Set(prev.map(m => m.id));
        const newOlderMessages = apiMessages.filter(m => !prevIds.has(m.id));
        if (newOlderMessages.length === 0) return prev;

        return [...prev, ...newOlderMessages];
      }

      const newestApiTime =
        apiMessages.length > 0
          ? new Date(apiMessages[0].created_at).getTime()
          : 0;

      const newerLocalMessages = prev.filter(
        m =>
          m.id <= 1000000000000 &&
          new Date(m.created_at).getTime() > newestApiTime &&
          !apiMessages.some(a => a.id === m.id),
      );

      const combined = [...newerLocalMessages, ...tempMessages, ...apiMessages];

      return combined.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    });

    setIsLoadingMore(false);
  }, [messagesData]);

  useEffect(() => {
    if (!socketMessages || socketMessages.length === 0) return;

    const incomingSocketMsgs = socketMessages as Message[];
    const newMsgsFromOthers: Message[] = [];

    incomingSocketMsgs.forEach(socketMsg => {
      if (
        socketMsg.sender_type !== senderType &&
        !processedSocketIdsRef.current.has(socketMsg.id)
      ) {
        newMsgsFromOthers.push(socketMsg);
      }
    });

    if (newMsgsFromOthers.length > 0) {
      setMessages(prev => {
        const prevIds = new Set(prev.map(m => m.id));
        const toAdd = newMsgsFromOthers.filter(m => !prevIds.has(m.id));
        if (toAdd.length === 0) return prev;
        toAdd.forEach(m => processedSocketIdsRef.current.add(m.id));
        return [...toAdd, ...prev].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      });

      if (conversationId) {
        handleMarkAsRead(newMsgsFromOthers.map(m => m.id));
      }

      newMsgsFromOthers.forEach(newMessage => {
        try {
          store.dispatch(
            supportChatSlice.util.updateQueryData(
              'getAdminConversations',
              {page: 1, limit: 20},
              (draft: any) => {
                if (!draft.data) return;
                const index = draft.data.findIndex(
                  (c: any) => c.conversation_id === newMessage.conversation_id,
                );
                if (index !== -1) {
                  draft.data[index].unread_count = 0;
                  draft.data[index].last_message = {
                    message: newMessage.message,
                    message_type: newMessage.message_type,
                    sender_type: newMessage.sender_type,
                    created_at: newMessage.created_at,
                  };
                  const [updatedItem] = draft.data.splice(index, 1);
                  draft.data.unshift(updatedItem);
                }
              },
            ),
          );
        } catch (e) {}
      });
    }
  }, [socketMessages, senderType, conversationId, handleMarkAsRead]);

  const handleSend = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText && !uploadedUrl) return;
    if (!conversationId) return;

    const tempId = Date.now();
    const isMedia = !!uploadedUrl && !!uploadedType;
    const messageType = isMedia ? uploadedType : 'text';

    const tempMessage: Message = {
      id: tempId,
      conversation_id: Number(conversationId),
      sender_id: 0,
      receiver_id: 0,
      sender_type: senderType,
      message_type: messageType as Message['message_type'],
      message: trimmedText,
      media_url: isMedia ? uploadedUrl : null,
      thumbnail: null,
      duration: uploadedDuration,
      status: 'sent',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [tempMessage, ...prev]);

    const payload: any = {
      conversation_id: conversationId,
      message_type: messageType,
    };

    if (isMedia) {
      payload.media_url = uploadedUrl;
      payload.duration = uploadedDuration;
    } else {
      payload.message = trimmedText;
    }

    try {
      const result: any = await sendMessage(payload).unwrap();
      if (result?.data) {
        setMessages(prev => prev.map(m => (m.id === tempId ? result.data : m)));
      }
      if (isMedia) handleRemoveMedia();
    } catch (error) {
      console.log(error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAudio = (id: number | string, url: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      setAudioLoadingId(null);
    } else {
      setPlayingAudioId(id);
      setAudioLoadingId(id);
    }
  };

  const openMediaModal = (url: string, type: 'image' | 'video') => {
    if (type === 'video') setIsModalVideoLoading(true);
    setMediaModal({url, type});
  };

  const closeMediaModal = () => {
    setMediaModal(null);
    setIsModalVideoLoading(false);
  };
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const showListener = Keyboard.addListener(
      'keyboardWillChangeFrame',
      event => {
        const height =
          Dimensions.get('screen').height - event.endCoordinates.screenY;

        setKeyboardHeight(Math.max(height, 0));
      },
    );

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const renderMessage = ({item}: {item: Message}) => {
    const isMe = item.sender_type === senderType;
    const isDeleted = deletedIds.has(item.id);
    const isMenuOpen = menuVisibleId === item.id;

    const avatarUri = isMe
      ? profile?.image
      : participants.find(p => p.id === item.sender_id)?.profile_image;

    const renderMedia = () => {
      if (isDeleted) return null;

      if (item.message_type === 'image' && item.media_url) {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openMediaModal(item.media_url!, 'image')}
            style={styles.mediaContainer}>
            <Image
              source={{uri: item.media_url}}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }

      if (item.message_type === 'video' && item?.media_url) {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openMediaModal(item.media_url!, 'video')}
            style={styles.mediaContainer}>
            <View style={styles.videoContainer}>
              <Video
                source={{uri: item.media_url}}
                style={styles.mediaImage}
                resizeMode="cover"
                paused={true}
                repeat={false}
                muted={true}
              />
              <View style={styles.playIconWrapper}>
                <View style={styles.playIcon} />
              </View>
              {item.duration ? (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      }

      if (item.message_type === 'audio' && item?.media_url) {
        const isPlaying = playingAudioId === item.id;
        const isLoading = audioLoadingId === item.id;

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePlayAudio(item?.id, item.media_url!)}
            style={styles.audioContainer}>
            <View
              style={[
                styles.audioPlayBtn,
                isPlaying &&
                  !isLoading && {backgroundColor: COLORS.GRAY_TEXT_COLOR},
              ]}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : isPlaying ? (
                <View style={{flexDirection: 'row', gap: 2.5}}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              ) : (
                <View style={styles.playSmallIcon} />
              )}
            </View>
            <View style={styles.audioWaveContainer}>
              <View style={styles.waveform}>
                {WAVEFORM_HEIGHTS.map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: h,
                        backgroundColor: isPlaying
                          ? COLORS.SECONDARY_COLOR
                          : COLORS.GRAY_TEXT_COLOR,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.audioDurationText}>
                {formatDuration(item.duration)}
              </Text>
            </View>

            {isPlaying && (
              <Video
                ref={audioPlayerRef}
                source={{
                  uri: item?.media_url,
                }}
                paused={false}
                muted={false}
                volume={1}
                repeat={false}
                ignoreSilentSwitch="ignore"
                playWhenInactive={true}
                playInBackground={false}
                progressUpdateInterval={100}
                onLoad={() => setAudioLoadingId(null)}
                onEnd={() => {
                  setPlayingAudioId(null);
                  setAudioLoadingId(null);
                }}
                onError={() => {
                  setPlayingAudioId(null);
                  setAudioLoadingId(null);
                }}
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  opacity: 0.01,
                }}
              />
            )}
          </TouchableOpacity>
        );
      }
      return null;
    };

    return (
      <View style={[styles.row, isMe && styles.rowReverse]}>
        <AppImage
          path={isMe ? undefined : IMAGE_LOGO}
          uri={isMe ? avatarUri : undefined}
        />

        <View style={styles.bubbleWrapper}>
          {isMe && !isDeleted && (
            <TouchableOpacity
              style={styles.dotBtn}
              onPress={() => setMenuVisibleId(isMenuOpen ? null : item.id)}
              activeOpacity={0.6}>
              <View style={styles.verticalDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.bubble,
              isMe ? styles.myBubble : styles.otherBubble,
            ]}>
            {renderMedia()}

            {isDeleted ? (
              <Text style={[styles.text, styles.deletedTextStyle]}>
                {isMe ? 'Your message is deleted' : 'This message is deleted'}
              </Text>
            ) : item.message ? (
              <Text style={styles.text}>{item.message}</Text>
            ) : null}

            <View style={styles.bottomRow}>
              <Text style={styles.time}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </Text>
              {isMe && !isDeleted && <MessageStatusTick status={item.status} />}
            </View>
          </View>

          {!isDeleted && (
            <View
              style={[styles.tail, isMe ? styles.tailRight : styles.tailLeft]}>
              {isMe ? <ICON_SEND_RADIUS /> : <ICON_RECIEVER_RADIUS />}
            </View>
          )}

          {isMe && isMenuOpen && !isDeleted && (
            <View style={styles.popupMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleDeleteMessage(item.id)}>
                <ICON_DELETE width={18} height={18} />
                <Text style={[styles.menuText, styles.menuTextDelete]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'my_recording.wav',
      });
    }
  };

  const handlePickMedia = () =>
    pickMedia({mediaType: 'mixed', selectionLimit: 1});

  const handleCapturePhoto = () => capturePhoto();

  const handleCaptureVideo = () => captureVideo();

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setMessages([]);
    setLimit(20);
    isPaginating.current = false;
    setIsLoadingMore(false);
    if (conversationId) {
      store.dispatch(
        supportChatSlice.util.invalidateTags([
          {type: 'SupportChat', id: `Messages-${conversationId}`},
        ]),
      );
    }
  }, [conversationId]);

  // ==========================================
  // KEYBOARD HANDLING (Exact same logic from Chat.tsx)
  // ==========================================
  const {height} = useKeyboardAnimation();
  const isTabScreen = useIsTabScreen();
  const tabBarHeight = isTabScreen ? scaleSize(70) : 0;
  const fakeView = useAnimatedStyle(() => {
    const computedValue = height.value;
    return {
      height: Math.max(0, Math.abs(computedValue) - tabBarHeight - bottom),
      marginBottom: isTabScreen ? 0 : bottom + 20,
    };
  }, [bottom, tabBarHeight]);

  return (
    <AppView customViewStyle={styles.screen}>
      <ChatHeader
        isLeftIcon={true}
        title={
          mode === 'admin'
            ? userName ?? 'User Chat'
            : TEXT.SUPPORT_CHAT ?? 'Support Chat'
        }
        status={isOtherUserOnline ? 'online' : undefined}
        onlayout={() => {}}
      />

      {/* REMOVED KeyboardAvoidingView, using FlatList directly like Chat.tsx */}
      <FlatList
        ref={flatListRef}
        key={conversationId}
        inverted
        data={messages}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? keyboardHeight + 80 : 80,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              style={styles.loader}
              size="small"
              color={COLORS.SECONDARY_COLOR}
            />
          ) : !hasMore && messages.length > 0 ? (
            <View style={styles.noMoreContainer}>
              <Text style={styles.noMoreText}>No more messages</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isApiFetching && !isRefreshing ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
            </View>
          ) : null
        }
      />

      <View
        style={{
          paddingBottom: Platform.OS === 'ios' ? keyboardHeight - 10 : 0,
        }}>
        <ChatInput
          showInputIcon
          onPress={handleSend}
          showImage
          openGallery={handlePickMedia}
          capturePhoto={handleCapturePhoto}
          captureVideo={handleCaptureVideo}
          handleAudio={handleToggleRecording}
          uploadedUrl={uploadedUrl}
          uploadedType={uploadedType}
          isUploading={isUploading}
          isRecording={isRecording}
          onRemoveMedia={handleRemoveMedia}
        />
      </View>

      {/* ADDED: fakeView to handle keyboard push smoothly */}
      {Platform.OS === 'android' && <Animated.View style={fakeView} />}
      <Modal
        visible={!!mediaModal}
        transparent
        animationType="fade"
        onRequestClose={closeMediaModal}
        statusBarTranslucent>
        <Pressable style={styles.modalOverlay} onPress={closeMediaModal}>
          <Pressable
            style={styles.modalContentContainer}
            onPress={e => e.stopPropagation()}>
            <Pressable style={styles.modalCloseBtn} onPress={closeMediaModal}>
              <Text style={styles.modalCloseBtnText}>X</Text>
            </Pressable>

            {mediaModal?.type === 'image' && (
              <Image
                source={{uri: mediaModal.url}}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}

            {mediaModal?.type === 'video' && (
              <View style={styles.modalVideo}>
                {isModalVideoLoading && (
                  <ActivityIndicator
                    size="large"
                    color={COLORS.WHITE_COLOR}
                    style={{position: 'absolute', zIndex: 10}}
                  />
                )}

                <Video
                  key={mediaModal.url}
                  source={{uri: mediaModal.url}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                  controls={true}
                  paused={false}
                  onLoadStart={() => setIsModalVideoLoading(true)}
                  onReadyForDisplay={() => setIsModalVideoLoading(false)}
                  onError={() => setIsModalVideoLoading(false)}
                  bufferConfig={{
                    minBufferMs: 500,
                    maxBufferMs: 1500,
                    //@ts-ignore
                    playBufferMs: 250,
                    bufferForPlaybackMs: 250,
                    bufferForPlaybackAfterRebufferMs: 500,
                  }}
                />
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </AppView>
  );
};

export default SupportChat;

const styles = StyleSheet.create({
  screen: {paddingBottom: 0},
  listContent: {
    flexGrow: 1,
    backgroundColor: COLORS.APP_BACKGROUND,
    paddingVertical: SPACING.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.custom(8),
    paddingHorizontal: 0,
    marginVertical: scaleSize(6),
  },
  rowReverse: {flexDirection: 'row-reverse'},
  bubbleWrapper: {maxWidth: SCREEN_WIDTH * 0.7, position: 'relative'},
  bubble: {
    borderRadius: SPACING.custom(12),
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
    minHeight: scaleSize(44),
  },
  myBubble: {backgroundColor: '#E7E6DC'},
  otherBubble: {backgroundColor: COLORS.WHITE_COLOR},
  text: {
    fontSize: FONT_VARIENTS.custom(14),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONT_FAMILY.Regular,
  },
  time: {
    fontSize: scaleSize(10),
    color: COLORS.GRAY_TEXT_COLOR,
    marginTop: SPACING.xxs,
  },
  tail: {position: 'absolute', bottom: 0},
  tailRight: {right: -6},
  tailLeft: {left: -6},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {color: COLORS.GRAY_TEXT_COLOR, fontSize: 15},
  loader: {paddingVertical: SPACING.m},
  noMoreContainer: {paddingVertical: SPACING.s, alignItems: 'center'},
  noMoreText: {color: COLORS.GRAY_TEXT_COLOR, fontSize: scaleSize(12)},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  menuText: {
    fontSize: FONT_VARIENTS.custom(14),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONT_FAMILY.Medium,
  },
  menuTextDelete: {color: 'red'},
  deletedTextStyle: {
    fontStyle: 'italic',
    color: COLORS.GRAY_TEXT_COLOR,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mediaContainer: {
    width: SCREEN_WIDTH * 0.42,
    aspectRatio: 4 / 3,
    borderRadius: SPACING.custom(10),
    overflow: 'hidden',
    marginBottom: SPACING.xxs,
    backgroundColor: '#f0f0f0',
  },
  mediaImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -scaleSize(16)}, {translateY: -scaleSize(16)}],
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(16),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: scaleSize(8),
    borderBottomWidth: scaleSize(8),
    borderLeftWidth: scaleSize(12),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFF',
    marginLeft: scaleSize(3),
  },
  durationBadge: {
    position: 'absolute',
    bottom: SPACING.xxs,
    right: SPACING.xxs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: scaleSize(4),
    paddingVertical: scaleSize(1),
    borderRadius: scaleSize(4),
  },
  durationText: {
    color: '#FFF',
    fontSize: scaleSize(9),
    fontFamily: FONT_FAMILY.Medium,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: 0,
    minWidth: scaleSize(150),
    height: scaleSize(36),
  },
  audioPlayBtn: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playSmallIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: scaleSize(5),
    borderBottomWidth: scaleSize(5),
    borderLeftWidth: scaleSize(8),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFF',
    marginLeft: scaleSize(1.5),
  },
  pauseBar: {
    width: scaleSize(2.5),
    height: scaleSize(10),
    backgroundColor: '#FFF',
    borderRadius: scaleSize(1),
  },
  audioWaveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xxs,
    marginTop: 26,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(28),
    gap: scaleSize(2),
  },
  waveBar: {width: scaleSize(3), borderRadius: scaleSize(1.5)},
  audioDurationText: {
    alignSelf: 'flex-start',
    fontSize: scaleSize(10),
    color: COLORS.GRAY_TEXT_COLOR,
    fontFamily: FONT_FAMILY.Medium,
    marginRight: 24,
  },

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
    width: '95%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: SPACING.s,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.m,
    width: scaleSize(36),
    height: scaleSize(36),
    borderRadius: scaleSize(18),
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontSize: scaleSize(16),
    fontWeight: 'bold',
  },

  dotBtn: {
    position: 'absolute',
    top: 5,
    right: -4,
    width: scaleSize(24),
    height: scaleSize(24),
    borderRadius: scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  verticalDots: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(14),
    width: scaleSize(14),
    gap: scaleSize(2),
  },
  dot: {
    width: scaleSize(3),
    height: scaleSize(3),
    borderRadius: scaleSize(1.5),
    backgroundColor: COLORS.GRAY_TEXT_COLOR,
  },
  popupMenu: {
    position: 'absolute',
    top: scaleSize(40),
    right: -4,
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: SPACING.s,
    paddingVertical: SPACING.xxs,
    minWidth: scaleSize(120),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },
});
