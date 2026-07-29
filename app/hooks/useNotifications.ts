import {useEffect} from 'react';
import {Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {navigate, navigationRef} from '@navigation-utils';
import {getPrefsValue, RouteNames, setPrefsValue} from '@utils';
import {STORAGE} from '@constants';
import {store} from '../redux/store';

type NotificationData = Record<string, string>;
const CHANNEL_ID = 'default';

let pendingNotificationData: any = null;

export const getPendingNotification = () => pendingNotificationData;

export const clearPendingNotification = () => {
  pendingNotificationData = null;
};

const useNotifications = () => {
  useEffect(() => {
    let unsub1: (() => void) | undefined;
    let unsub2: (() => void) | undefined;
    let unsub3: (() => void) | undefined;
    let unsub4: (() => void) | undefined;

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
      unsub1 = messaging().onMessage(onForegroundMessage);
      unsub2 = messaging().onNotificationOpenedApp(remoteMessage => {
        const isLogin = store.getState().app.isLogin;
        if (!isLogin) return;

        handleNotification(remoteMessage.data);
      });

      unsub3 = notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          const isLogin = store.getState().app.isLogin;
          if (!isLogin) return;

          handleNotification(
            detail.notification?.data as NotificationData | undefined,
          );
        }
      });

      unsub4 = messaging().onTokenRefresh(async token => {
        const isLogin = store.getState().app.isLogin;
        if (!isLogin) return;
        setPrefsValue(STORAGE.FCM_TOKEN, token);
        setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, '');
      });
    };

    setup();

    return () => {
      unsub1?.();
      unsub2?.();
      unsub3?.();
      unsub4?.();
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
    sound: 'default',
  });
}

async function requestPermission() {
  if (Platform.OS === 'android') {
    await notifee.requestPermission();
  }

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
  const isLogin = store.getState().app.isLogin;
  if (!isLogin) {
    console.log('🔥 Notification blocked - User is logged out');
    return;
  }

  const currentRoute: any = navigationRef?.getCurrentRoute();

  const isOnThisExactChat =
    currentRoute?.name === RouteNames.SUPPORT_CHAT &&
    String(currentRoute?.params?.conversationId) ===
      String(remoteMessage.data?.conversationId);

  if (!isOnThisExactChat) {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title ?? '',
      body: remoteMessage.notification?.body ?? '',
      data: remoteMessage.data,

      android: {
        channelId: CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
        sound: 'default',
        importance: AndroidImportance.HIGH,
      },

      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  }
}

export function handleNotification(data?: any) {
  if (!data) return;

  const isLogin = store.getState().app.isLogin;
  if (!isLogin) return;

  if (data?.type === 'support_chat' && data?.conversationId) {
    const Profile = store.getState()?.app?.userInfo;

    const userDataStr: any = getPrefsValue(STORAGE.USER_DATA);

    let mmkvUser = null;

    try {
      mmkvUser = userDataStr ? JSON.parse(userDataStr) : null;
    } catch (e) {}

    const finalUser = Profile || mmkvUser;

    const role = finalUser?.role || finalUser?.user?.role;

    const isAdmin = String(role).toLowerCase() === 'admin';

    const name = finalUser?.name || finalUser?.user?.name || '';

    const convId = Number(data?.conversationId);

    if (isNaN(convId)) return;

    setTimeout(() => {
      if (isAdmin) {
        navigate(RouteNames.USER_LIST);
      } else {
        navigate(RouteNames.SUPPORT_CHAT, {
          mode: 'user',
          conversationId: convId,
          userName: name,
        });
      }
    }, 300);
  }
}

// ✅ NEW: Add this function to properly logout and delete token
export const logoutAndDeleteToken = async () => {
  try {
    // 1. Actually DELETE the FCM token from Firebase
    await messaging().deleteToken();
    console.log('🔑 FCM Token deleted successfully');
  } catch (error) {
    console.error('Failed to delete FCM token:', error);
  }

  // 2. Clear all notification-related storage
  setPrefsValue(STORAGE.FCM_TOKEN, '');
  setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, '');
  setPrefsValue(STORAGE.REGISTERED_USER_ID, '');

  // 3. Cancel all pending notifications
  await notifee.cancelAllNotifications();
};
