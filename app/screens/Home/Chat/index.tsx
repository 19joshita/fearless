import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  FlatList,
  Platform,
  View,
} from 'react-native';
import {
  AppConfirmationModal,
  AppLabel,
  AppTextInput,
  AppView,
} from '@global-components';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {
  ChatBubble,
  ChatEmpty,
  ChatHeader,
  ChatInput,
  ChatLoader,
  ChatThinkingAnimation,
} from '@components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useKeyboardAnimation from './UseKeyboardAnimation';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {EVENTS, STORAGE} from '@constants';
import {
  useCreateChatRoomMutation,
  useDeleteChatMutation,
  useLazyExportChatQuery,
  useLazyGetMessagesQuery,
  useLazyPendingMessageQuery,
  useSendMessageMutation,
} from '@redux/chat-api-slice';
import {
  downloadFile,
  Emitter,
  ENDPOINTS,
  generateChatFilename,
  generateUUIDv4,
  getPrefsValue,
  normalizeName,
  RouteNames,
  setPrefsValue,
} from '@utils';
import {ChatMessage} from './types';
import {useAppDispatch, useAppSelector} from '@redux/reduxHook';
import {useEditChat} from './useEditChat';
import {ICON_CLOSE_ROUND, ICON_CONFIRM} from '@assets/icons';
import Toast from 'react-native-toast-message';
import styles from './styles';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  ChatTabRootStackParamList,
  AgentTabRootStackParamList,
  goBack,
  ResourcesTabRootStackParamList,
  navigate,
} from '@navigation-utils';
import useIsTabScreen from './useIsTabScreen';
import {useText} from '@localization';
import {removePendingMessage} from '@redux/app-slice';
import {isPending} from '@reduxjs/toolkit';
import {PromptType} from 'components/Chat/ChatEmpty/topics';
import ResourcesStack from '../../../navigation/stacks/ResourcesStack';
import ResourceList from '../../../screens/Resources/ResourcesList';
import {checkAIConsent} from './Chatconsent';

const PAGE_SIZE = 10;

type ChatRouteProp =
  | RouteProp<ChatTabRootStackParamList, typeof RouteNames.CHAT_TAB>
  | RouteProp<AgentTabRootStackParamList, typeof RouteNames.AGENT_CHAT>
  | RouteProp<ResourcesTabRootStackParamList, typeof RouteNames.ASSISTANT_CHAT>;

const Chat = () => {
  const route = useRoute<ChatRouteProp>();
  const isAssistant = route.params?.isAssitant || false;
  const savedChatParamsId = route.params?.savedChatParamsId;
  const savedChatName = route.params?.savedChatName;
  const isAgent = route.params?.type === 'agent';
  // const getTopic = route.params?.selectedTopic;
  const {TEXT} = useText();
  const chatId = isAssistant
    ? getPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID)
    : isAgent
    ? getPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID)
    : getPrefsValue(STORAGE.CHAT_ROOM_ID);
  const {bottom} = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const [renameChatVisible, setRenameChatVisible] = useState<boolean>(false);
  const [saveChatLoading, setSaveChatLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatRoomId, setChatRoomId] = useState<string>(chatId || '');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [deleteChat, {isLoading: deleteLoading, isError, isSuccess}] =
    useDeleteChatMutation();
  const [
    triggerExportChat,
    {isLoading: exportLoading, isFetching: exportFetching},
  ] = useLazyExportChatQuery();
  const [downloadingFile, setDownloadingFile] = useState<boolean>(false);
  const Profile = useAppSelector(state => state?.app?.userInfo);
  console.log('Profile===>', Profile);
  const isConnected = useAppSelector(state => state?.app?.isInternetConnected);

  const [triggerCreateChatRoom, {isLoading: createRoomLoading}] =
    useCreateChatRoomMutation();
  const [triggerSendMessage, {isLoading}] = useSendMessageMutation();
  const [triggerFetchMessages, {isLoading: fetchMessageLoading, isFetching}] =
    useLazyGetMessagesQuery();
  const {editChat, isLoading: editChatLoading, error} = useEditChat();
  const [chatName, setChatName] = useState<string>(
    savedChatName
      ? savedChatName
      : isAssistant
      ? TEXT.RESOURCES
      : isAgent
      ? TEXT.AGENTS
      : 'Companion',
  );
  const [globalName, setGlobalName] = useState<string>('');
  const dispatch = useAppDispatch();

  //Paginations
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isInitialized = useRef<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [loadingSocket, setLoadingSocket] = useState<boolean>(false);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);

  // handle chat expiration for non savechats
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isChatSaved, setIsChatSaved] = useState(false);
  const expirationTime = useRef<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<string>('');

  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLanguage = useAppSelector(state => state.app.currentLanguage);

  const pendingMessages = useAppSelector(
    state => state.app.queueMessages,
  ).filter(pending => pending.roomId === chatRoomId);
  //Pending Message API Query,
  const [
    triggerGetPendingMessage,
    {isLoading: pendingLoading, isFetching: pendingFetching},
  ] = useLazyPendingMessageQuery();

  useEffect(() => {
    chatRoomId && currentLanguage && callFetchMessages(chatRoomId);
  }, [currentLanguage]);

  const handleOnSend = (message: ChatMessage) => {
    setChatMessages(prev => [message, ...(prev ?? [])]);
    {
      message?.uuid === Profile?.uuid &&
        requestAnimationFrame(() => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
          }, 100);
        });
    }
  };

  const callCreateChatRoom = async (): Promise<
    CreateRoomSucessResponse['data'] | null
  > => {
    try {
      const response = await triggerCreateChatRoom({
        type: isAgent ? 'agent' : 'advisor',
      }).unwrap();

      if (response?.success) {
        console.log('create chat ', response, response?.data?.name);
        const id = response.data.uuid;
        isAssistant
          ? setPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID, id)
          : isAgent
          ? setPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID, id)
          : setPrefsValue(STORAGE.CHAT_ROOM_ID, id);
        setChatRoomId(id);
        setIsChatSaved(response?.data?.is_saved);
        setExpiryTime(response?.data?.expire_time);
        if (isAssistant) {
          setChatName(TEXT.RESOURCES);
        } else if (!isAgent) {
          setChatName(TEXT.CHAT);
        } else {
          // Runs only when isAgent = true AND isAssistant = false
          setChatName(
            chatMessages?.length > 0 ? response?.data?.name : TEXT.AGENTS,
          );
        }

        expirationTime.current = response?.data?.expire_time;
        console.log('call create room, ', response, isChatSaved, expiryTime);
        return response?.data;
      }
    } catch (error) {
      console.error('Create chat room failed', error);
    }
    return null;
  };

  const bgTask = async (message: string, role?: string) => {
    const body = {
      roomId: chatRoomId,
      params: {
        prompt: message,
        ...(role && {role}),
      },
      isAgent,
    };

    try {
      const response = await triggerSendMessage(body).unwrap();
      if (response?.success) {
        const msg: ChatMessage = {
          uuid: generateUUIDv4(),
          user: '',
          room: chatRoomId,
          prompt: '',
          response: response?.response,
          created_at: response?.created_at,
          updated_at: response?.updated_at,
        };
        setTypingMessageId(msg.uuid);
        setIsTyping(true);
        handleOnSend(msg);
      }
    } catch (error) {
      console.error('sendMessageResponse', error);
      setLoadingSocket(false);
      setIsTyping(false);
    } finally {
    }
  };

  const callSendMessage = async (message: string, role?: string) => {
    console.log('chatroom ', chatRoomId);
    setTypingMessageId(null);
    setIsTyping(false);
    if (role) {
      bgTask(message, role);
    } else {
      bgTask(message);
    }
  };

  const handleExpiredRoom = async () => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current!);
    }
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current!);
    }
    isAssistant
      ? setPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID, '')
      : isAgent
      ? setPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID, '')
      : setPrefsValue(STORAGE.CHAT_ROOM_ID, '');
    setChatRoomId('');
    setChatMessages([]);
    setChatName(new Date().toISOString());
    const newRoom = await callCreateChatRoom();
    if (newRoom?.uuid) {
      isAssistant
        ? setPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID, newRoom?.uuid)
        : isAgent
        ? setPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID, newRoom?.uuid)
        : setPrefsValue(STORAGE.CHAT_ROOM_ID, newRoom?.uuid);
      setChatRoomId(newRoom?.uuid);
      if (isAssistant && chatMessages?.length === 0) {
        setChatName(TEXT.RESOURCES);
      } else if (!isAgent) {
        setChatName(TEXT.CHAT);
      } else {
        setChatName(chatMessages?.length > 0 ? newRoom?.name : TEXT.AGENTS);
      }
      setGlobalName(newRoom?.name);
    }
  };

  const callFetchMessages = async (
    roomId: string,
    page = 1,
    isRefresh = false,
  ) => {
    const isPaginatedCall = page > 1;

    // Guard: prevent over-fetch
    if (
      isPaginatedCall &&
      totalCount != null &&
      chatMessages.length >= totalCount
    ) {
      setIsFetchingMore(false);
      console.log('returning');

      return;
    }
    console.log('fethivn');

    try {
      const response = await triggerFetchMessages({
        roomId,
        page,
        limit: PAGE_SIZE,
      }).unwrap();
      console.log('fetching messages ', response);

      if (response?.success && Array.isArray(response?.data)) {
        if (response?.is_time_passed && !savedChatParamsId) {
          handleExpiredRoom();
          return;
        }

        if (response?.expire_time) {
          setIsChatSaved(false);
          setExpiryTime(response?.expire_time);
          expirationTime.current = response?.expire_time || '';
        } else {
          setIsChatSaved(true);
          setExpiryTime('');
          expirationTime.current = null;
        }
        if (isRefresh || page === 1) {
          setChatMessages(response.data);
          setCurrentPage(2); // Next page to fetch is 2
        } else {
          setChatMessages(prev => [...prev, ...response.data]);
          setCurrentPage(page + 1); // Next page to fetch
        }

        if (typeof response.count === 'number') {
          setTotalCount(response.count);
        }
        if (isAssistant && response?.data?.length === 0) {
          setChatName(TEXT.RESOURCES);
          setGlobalName(TEXT.RESOURCES);
          return;
        }
        if (!isAgent) {
          setChatName(
            savedChatName || chatMessages?.length > 0
              ? response?.room_name
              : TEXT.CHAT,
          );
          setGlobalName(savedChatName || response?.room_name || TEXT.CHAT);
          return;
        }
        setChatName(
          savedChatName
            ? savedChatName
            : response?.data?.length > 0
            ? response?.room_name
            : TEXT.AGENTS,
        );
        setGlobalName(response?.room_name);
        return;
      }
    } catch (error) {
      console.error('Fetch failed', error);
      //@ts-ignore
      if (error?.status == 404 && !error?.data?.is_room) {
        await handleExpiredRoom();
      } else {
        Toast.show({
          //@ts-ignore
          text1: error?.data?.message || 'Something went wrong!',
          type: 'error',
        });
      }
    } finally {
      setIsFetchingMore(false);
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (
      isFetchingMore ||
      chatMessages?.length <= 0 ||
      (totalCount && chatMessages?.length >= totalCount)
    ) {
      return;
    }
    if (chatMessages?.length < PAGE_SIZE) {
      return;
    }

    setIsFetchingMore(true);
    callFetchMessages(chatRoomId, currentPage);
  };

  useEffect(() => {
    const initializeChat = async () => {
      const existingId = isAssistant
        ? getPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID)
        : isAgent
        ? getPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID)
        : getPrefsValue(STORAGE.CHAT_ROOM_ID);
      if (existingId) {
        setChatRoomId(existingId);
        await callFetchMessages(existingId);
      } else {
        // const newId = await callCreateChatRoom();
        // if (newId) {
        //   setPrefsValue(STORAGE.CHAT_ROOM_ID, newId);
        //   setChatRoomId(newId);
        // }
        handleExpiredRoom();
        return;
      }
    };

    Emitter.on(EVENTS.DELETE_CHAT, (chatIdToDelete: string) => {
      if (
        chatIdToDelete === chatRoomId ||
        chatIdToDelete ===
          (isAssistant
            ? getPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID)
            : isAgent
            ? getPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID)
            : getPrefsValue(STORAGE.CHAT_ROOM_ID))
      ) {
        handleExpiredRoom();
        return;
      }
    });

    Emitter.on(EVENTS.RENAME_SAVED_CHAT, (chat: ChatRoom) => {
      if (
        chat?.uuid === chatRoomId ||
        chat?.uuid ===
          (isAssistant
            ? getPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID)
            : isAgent
            ? getPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID)
            : getPrefsValue(STORAGE.CHAT_ROOM_ID))
      ) {
        setChatName(chat?.name);
        setGlobalName(chat?.name);
      }
    });

    const handleSavedChatShow = async (savedId: string) => {
      setChatRoomId(savedId);
      await callFetchMessages(savedId);
      return;
    };

    if (savedChatParamsId) {
      handleSavedChatShow(savedChatParamsId);
      return;
    } else {
      initializeChat();
    }
    return () => {
      setTypingMessageId(null);
      Emitter.off(EVENTS.DELETE_CHAT);
      Emitter.off(EVENTS.RENAME_SAVED_CHAT);
    };
  }, []);

  useEffect(() => {
    // if (isChatSaved || !expirationTime.current) return;
    if (isChatSaved || !expiryTime) return;
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current!);
    }
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current!);
    }
    const now = Date.now();
    const timeLeft = new Date(expiryTime).getTime() - now;
    // const timeLeft = new Date(Date.now() + 4 * 60 * 1000).getTime() - now;
    const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes in ms
    // const WARNING_BEFORE = 2 * 60 * 1000; // 5 minutes in ms
    const warningDelay = timeLeft - WARNING_BEFORE;
    //  Show warning exactly when 5 minutes left
    if (warningDelay > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setIsWarningShown(true);
      }, warningDelay);
    } else if (timeLeft > 0) {
      // Already inside the 5-min window
      setIsWarningShown(true);
    }
    if (timeLeft > 0) {
      expirationTimeoutRef.current = setTimeout(() => {
        setIsExpired(true);
        setIsWarningShown(false);
        handleExpiredRoom();
        // Alert.alert('Alert ', 'Chat Expired');
      }, timeLeft);
    } else {
      setIsExpired(true);
    }

    // Clean up on unmount
    return () => {
      clearTimeout(warningTimeoutRef.current!);
      clearTimeout(expirationTimeoutRef.current!);
    };
  }, [isChatSaved, expiryTime]);

  // Background task handling

  const appState = useRef(AppState.currentState);
  let intervalRef = useRef<NodeJS.Timeout | null>(null);

  // logic to refetch the pending messages
  const refetchPendingMessage = async () => {
    if (loadingSocket) return;
    try {
      setLoadingSocket(true);
      const response = await triggerGetPendingMessage(chatRoomId);
      console.log('refetcing response ', response);
      if (response?.isSuccess) {
        if (!response?.data?.isError) {
          if (response?.data?.processing) {
            setLoadingSocket(true);
          }
          if (!response?.data?.processing && response?.data?.response) {
            // callSendMessage(response?.data?.response);
            const msg: ChatMessage = {
              uuid: generateUUIDv4(),
              user: '',
              room: chatRoomId,
              prompt: '',
              response: response?.data?.response,
              created_at: Date.now()?.toString(),
              updated_at: Date.now()?.toString(),
            };
            setTypingMessageId(msg.uuid);
            setIsTyping(true);
            handleOnSend(msg);
            setLoadingSocket(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            dispatch(removePendingMessage(chatRoomId));
          }
        } else {
          Alert.alert(
            'Error Sending the message',
            "Your last message wasn't sent",
          );
          setLoadingSocket(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          dispatch(removePendingMessage(chatRoomId));
        }
      }
    } catch (error) {
      console.error('Pending Error', error);
      setLoadingSocket(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      dispatch(removePendingMessage(chatRoomId));
    }
  };

  const shouldRefetch = useMemo(() => {
    return (
      !isLoading &&
      !pendingLoading &&
      !intervalRef?.current &&
      chatMessages[0]?.user === Profile?.uuid &&
      !isTyping &&
      isConnected
    );
  }, [isLoading, isPending, intervalRef?.current, chatMessages, isTyping]);

  const isMessagePending = useMemo(() => {
    return (
      pendingMessages.length > 0 &&
      pendingMessages[0]?.roomId === chatRoomId &&
      pendingMessages[0]?.pending
    );
  }, [pendingMessages, chatRoomId]);
  // console.log('last message ,', chatMessages[chatMessages.length - 1]);
  // useEffect(() => {
  //   intervalRef?.current && clearInterval(intervalRef?.current);
  //   intervalRef.current = null;
  //   const handleAppStateChange = (nextAppState: AppStateStatus) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === 'active'
  //     ) {
  //       console.log('📱 App came to foreground — Checking pending message');
  //       if (intervalRef?.current) {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //       intervalRef.current = setInterval(() => {
  //         // refetchPendingMessage();
  //         // if (isMessagePending) {
  //         if (shouldRefetch) {
  //           refetchPendingMessage();
  //         }
  //         // }
  //         if (!isMessagePending) {
  //           if (intervalRef.current) {
  //             clearInterval(intervalRef?.current);
  //             intervalRef.current = null;
  //           }
  //         }
  //       }, 2000);
  //     }
  //     appState.current = nextAppState;
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );
  //   return () => {
  //     subscription.remove();
  //     clearInterval(intervalRef?.current!);
  //     intervalRef.current = null;
  //   };
  // }, [isMessagePending, shouldRefetch, chatRoomId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        timeoutId = setTimeout(() => {
          if (shouldRefetch) {
            refetchPendingMessage();
          }
        }, 500);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldRefetch, chatRoomId]);

  // //////////******************************************* */

  const handlePromptPress = (prompt: PromptType) => {
    if (!isConnected) {
      Toast.show({
        text1: 'No internet connection',
        type: 'error',
      });
      return;
    }
    const msg: ChatMessage = {
      uuid: generateUUIDv4(),
      user: Profile?.uuid || '',
      room: chatRoomId,
      prompt: prompt?.title,
      response: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // const ChatName = normalizeName(prompt?.role)
    //   ? normalizeName(prompt?.role)
    //   : isAgent
    //   ? TEXT.AGENT
    //   : 'Advisor';

    const ChatName =
      isAgent && prompt.title
        ? prompt?.title
        : isAgent
        ? TEXT.AGENTS
        : TEXT.CHAT;

    setChatName(ChatName);
    setGlobalName(chatName);
    handleOnSend(msg);
    callSendMessage(prompt?.title, prompt?.role);
  };

  const callExportChat = async () => {
    try {
      if (Platform.OS === 'ios') {
        setDownloadingFile(true);
      }
      const response = await triggerExportChat(chatRoomId);
      if (response?.data?.pdf_url) {
        downloadFile(response.data?.pdf_url, generateChatFilename());
      }
    } catch (error) {
      console.error('Error Generating Pdf', error);
    } finally {
      setDownloadingFile(false);
    }
    // Linking.openURL(response?.data?.pdf_url);
  };

  const handleRename = async () => {
    const res = await editChat(chatRoomId, {
      name: chatName,
    });
    if (res?.success && savedChatParamsId) {
      Emitter.emit(EVENTS.RENAME_SAVED_CHAT, res?.data);
    }
    setChatName(res?.data?.name || '');
    setGlobalName(res?.data?.name || '');
    setRenameChatVisible(false);
  };

  const handleSave = async () => {
    setSaveChatLoading(true);
    const res = await editChat(chatRoomId, {
      is_saved: true,
      name: chatName,
    });
    if (res?.success) {
      setChatName(res?.data?.name || '');
      setGlobalName(res?.data?.name || '');
      setSaveChatLoading(false);
      if (!savedChatParamsId) {
        setIsChatSaved(true);
        setIsWarningShown(false);
        setIsExpired(false);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current!);
      }
      if (expirationTimeoutRef.current) {
        clearTimeout(expirationTimeoutRef.current!);
      }
    }
  };

  const handleDeleteChat = async () => {
    try {
      const response = await deleteChat(chatRoomId).unwrap();
      if (response?.success) {
        Toast.show({
          text1: response?.message,
          type: 'success',
        });

        if (savedChatParamsId) {
          Emitter.emit(EVENTS.DELETE_SAVED_CHAT, chatRoomId);
          Emitter.emit(EVENTS.DELETE_CHAT, chatRoomId);
          goBack();
        } else {
          isAssistant
            ? setPrefsValue(STORAGE.ASSITANT_CHAT_ROOM_ID, '')
            : isAgent
            ? setPrefsValue(STORAGE.AGENT_CHAT_ROOM_ID, '')
            : setPrefsValue(STORAGE.CHAT_ROOM_ID, '');
          setChatMessages([]);
          setChatRoomId('');
          callCreateChatRoom();
        }
      }
      setTypingMessageId(null);
      setIsTyping(false);
    } catch (err) {
      console.error('Failed to delete chat:', err);
    } finally {
      setIsDelete(false);
    }
  };

  const connectSocket = useRef<WebSocket | null>(null);
  const chatSocket = useRef<WebSocket | null>(null);

  // Animations for handling keyboard and chat view
  const {height} = useKeyboardAnimation();
  const isTabScreen = useIsTabScreen();
  const tabBarHeight = isTabScreen ? scaleSize(70) : 0;
  const fakeView = useAnimatedStyle(() => {
    const computedValue = height.value;
    return {
      height: Math.abs(computedValue) - (tabBarHeight + bottom),
      marginBottom: isTabScreen ? 0 : bottom,
    };
  }, [bottom, tabBarHeight]);

  const shouldShowWarningBanner =
    !isChatSaved && (isWarningShown || chatMessages?.length === 0);

  const renderWarningBanner = () => {
    if (!shouldShowWarningBanner) {
      return null;
    }
    return (
      <View
        style={[
          styles.warningStyle,
          {marginTop: headerHeight ? SPACING.custom(12) : SPACING.s},
        ]}>
        <AppLabel
          text={
            isWarningShown
              ? TEXT.CHAT_EXPIRY_WARNING
              : TEXT.CHAT_DELETION_WARNING
          }
          color={'white'}
          textStyle={{flexShrink: 1}}
          fontFamily={FONT_FAMILY.Semibold}
          fontSize={FONT_VARIENTS.custom(13)}
          textAlign="center"
        />
      </View>
    );
  };

  const handleChatInput = useCallback(
    async (text: string) => {
      if (!isConnected) {
        Toast.show({
          text1: 'No internet connection',
          type: 'error',
        });
        return;
      }
      // const consent = await checkAIConsent();
      // if (!consent) return;
      const trimmed = text.trim();
      if (trimmed.length > 0) {
        const msg: ChatMessage = {
          uuid: generateUUIDv4(),
          user: Profile?.uuid || '',
          room: chatRoomId,
          prompt: trimmed,
          response: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        handleOnSend(msg);
        callSendMessage(trimmed);
      }
    },
    [isConnected, chatRoomId, Profile?.uuid, handleOnSend, callSendMessage],
  );

  const renameAnimatedStyle = useAnimatedStyle(() => {
    const addedHeight = bottom > 0 ? bottom + 20 : 100;
    return {
      transform: [
        {
          translateY: -height.value - addedHeight,
        },
      ],
    };
  }, [height, bottom]);

  return (
    <AppView customViewStyle={{paddingBottom: 0}}>
      <ChatHeader
        // isLeftIcon={canGoBack()}
        isLeftIcon={!isTabScreen}
        title={
          chatName
            ? chatName
            : isAssistant
            ? TEXT.RESOURCES
            : isAgent
            ? TEXT.AGENTS
            : TEXT.CHAT
        }
        onEditChatPress={() => setRenameChatVisible(true)}
        onExportPress={callExportChat}
        onSavePress={handleSave}
        onDeletePress={() => setIsDelete(true)}
        isDisabled={chatMessages?.length === 0}
        onlayout={setHeaderHeight}
      />
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={chatMessages}
        // Only invert when we have messages AND not during initial typing
        inverted={chatMessages?.length > 0}
        maintainVisibleContentPosition={
          chatMessages?.length > 0
            ? {
                minIndexForVisible: isTyping ? 1 : 0,
                autoscrollToTopThreshold: 50,
              }
            : undefined
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onScrollBeginDrag={() => setIsUserScrolling(true)}
        onMomentumScrollEnd={() => setIsUserScrolling(false)}
        onScrollEndDrag={() => setIsUserScrolling(false)}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListFooterComponent={
          <>
            {chatMessages?.length > 0 && renderWarningBanner()}
            {isFetchingMore ? (
              <ActivityIndicator
                style={{paddingVertical: SPACING.s}}
                size="small"
                color={COLORS.SECONDARY_COLOR}
              />
            ) : null}
          </>
        }
        keyExtractor={item => item.uuid}
        renderItem={({item, index}) =>
          isAgent && index === chatMessages?.length - 1 ? (
            <></>
          ) : (
            <ChatBubble
              isTyping={typingMessageId === item.uuid}
              isReciever={item?.user !== Profile?.uuid}
              text={item?.response ? item?.response : item?.prompt || ''}
              onTypingComplete={() => setIsTyping(false)}
            />
          )
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: isAssistant ? 'flex-start' : 'flex-end',
            }}>
            {!isAgent && renderWarningBanner()}
            {isAssistant ? (
              <ResourceList onPromptPress={handlePromptPress} />
            ) : (
              <ChatEmpty isAgent={isAgent} onPromptPress={handlePromptPress} />
            )}
          </View>
        }
        ListHeaderComponent={
          (isLoading || loadingSocket) && chatMessages?.length > 0 ? (
            <ChatThinkingAnimation />
          ) : null
        }
      />
      {(!isAgent || chatMessages?.length > 0) && (
        <ChatInput
          showImage
          onPress={handleChatInput}
          isDisabled={isLoading || isTyping}
        />
      )}

      <Animated.View style={fakeView} />

      {(fetchMessageLoading ||
        createRoomLoading ||
        saveChatLoading ||
        deleteLoading ||
        (savedChatParamsId && isFetching)) && (
        <ChatLoader
          loadingText={
            fetchMessageLoading || isFetching
              ? TEXT.FETCHING_CHAT
              : createRoomLoading
              ? TEXT.CREATING_CHAT
              : saveChatLoading
              ? TEXT.SAVING_CHAT
              : deleteLoading
              ? TEXT.DELETING_CHAT
              : ''
          }
        />
      )}
      {/* <AppContextMenu /> */}
      <AppConfirmationModal
        customComponent={
          <>
            <AppTextInput
              autoFocus={true}
              inputContainer={styles.renameInputStyle}
              inputStyle={{color: COLORS.WHITE_COLOR}}
              rightIcon={<ICON_CLOSE_ROUND />}
              input={chatName}
              setInput={setChatName}
              isError={!chatName && TEXT.FILE_NAME_REQUIRED}
              onRightIconPress={() => setChatName('')}
            />
          </>
        }
        customModalStyle={{justifyContent: 'flex-end'}}
        actionPerformed={TEXT.RENAME_CHAT}
        leftButton={true}
        leftButtonText={TEXT.CANCEL}
        rightButton={true}
        rightButtonText={TEXT.OK}
        visible={renameChatVisible}
        onPressLeftButton={() => {
          setRenameChatVisible(false);
          // setChatName(globalName || '');
        }}
        onPressRightButton={handleRename}
        rightButtonLoading={editChatLoading}
        customConainerStyle={renameAnimatedStyle}
      />
      {(exportLoading || exportFetching || downloadingFile) && (
        <ChatLoader loadingText={TEXT.EXPORTING_CHAT} />
      )}
      <AppConfirmationModal
        visible={isDelete}
        actionPerformed={TEXT.DELETE_CHAT_TITLE}
        confirmationText={TEXT.DELETE_CHAT_CONFIRM}
        icon={<ICON_CONFIRM />}
        isIcon={true}
        isCloseIcon={true}
        rightButton={true}
        rightButtonLoading={deleteLoading}
        rightButtonText={TEXT.DELETE_CHAT_TITLE}
        onPressLeftButton={() => setIsDelete(false)}
        onPressRightButton={handleDeleteChat}
        onClose={() => setIsDelete(false)}
      />
    </AppView>
  );
};

export default Chat;
