import {useEffect} from 'react';
import {Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {navigate} from '@navigation-utils';
import {getPrefsValue, setPrefsValue, RouteNames} from '@utils';
import {STORAGE} from '@constants';

type NotificationData = Record<string, string>;
const CHANNEL_ID = 'default';

let pendingNotificationData: any = null;
export const getPendingNotification = () => pendingNotificationData;
export const clearPendingNotification = () => {
  pendingNotificationData = null;
};

const useNotifications = () => {
  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeBackground: (() => void) | undefined;
    let unsubscribeNotifee: (() => void) | undefined;
    let unsubscribeToken: (() => void) | undefined;

    const setup = async () => {
      await createChannel();
      const hasPermission = await requestPermission();
      if (hasPermission) {
        const token = await getFCMToken();
        if (token) {
          setPrefsValue(STORAGE.FCM_TOKEN, token);
        }
      }
      await checkInitialNotification();

      unsubscribeForeground = messaging().onMessage(onForegroundMessage);

      unsubscribeBackground = messaging().onNotificationOpenedApp(
        remoteMessage => {
          handleNotification(remoteMessage.data);
        },
      );

      unsubscribeNotifee = notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          handleNotification(
            detail.notification?.data as NotificationData | undefined,
          );
        }
      });

      unsubscribeToken = messaging().onTokenRefresh(async token => {
        setPrefsValue(STORAGE.FCM_TOKEN, token);
        setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, '');
      });
    };

    setup();
    return () => {
      unsubscribeForeground?.();
      unsubscribeBackground?.();
      unsubscribeNotifee?.();
      unsubscribeToken?.();
    };
  }, []);
};

export default useNotifications;

async function createChannel() {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
}

async function requestPermission() {
  if (Platform.OS === 'android') await notifee.requestPermission();
  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function getFCMToken() {
  return await messaging().getToken();
}

async function checkInitialNotification() {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    pendingNotificationData = remoteMessage.data;
  }
}

async function onForegroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  const currentUserId = getPrefsValue(STORAGE.USER_ID);
  const notificationUserId = remoteMessage.data?.user_id;

  if (
    notificationUserId &&
    currentUserId &&
    notificationUserId !== currentUserId
  ) {
    console.log('Received notification for another user, ignoring.');
    return;
  }
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? '',
    body: remoteMessage.notification?.body ?? '',
    data: remoteMessage.data,
    android: {channelId: CHANNEL_ID, pressAction: {id: 'default'}},
    ios: {sound: 'default'},
  });
}

export function handleNotification(data?: any) {
  if (!data) return;
  const currentUserId = getPrefsValue(STORAGE.USER_ID);
  const notificationUserId = data?.user_id;
  if (
    notificationUserId &&
    currentUserId &&
    notificationUserId !== currentUserId
  )
    return;

  const token = getPrefsValue(STORAGE.TOKEN);
  if (!token) return;

  if (data?.type === 'support_chat' && data?.conversationId) {
    const userData = getPrefsValue(STORAGE.USER_DATA);
    let userInfo = null;
    try {
      userInfo = userData ? JSON.parse(userData) : null;
    } catch (e) {}

    setTimeout(() => {
      if (userInfo?.role === 'admin') {
        navigate(RouteNames.USER_LIST);
      } else {
        navigate(RouteNames.SUPPORT_CHAT, {
          mode: 'user',
          conversationId: Number(data?.conversationId),
          userName: userInfo?.name,
        });
      }
    }, 300);
  }
}
