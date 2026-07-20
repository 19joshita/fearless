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

// ==========================================
// PENDING NOTIFICATION STATE (FOR KILLED APP)
// ==========================================
let pendingNotificationData: any = null;
export const getPendingNotification = () => pendingNotificationData;
export const clearPendingNotification = () => {
  pendingNotificationData = null;
};

// ==========================================
// MAIN HOOK
// ==========================================
const useNotifications = () => {
  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeBackground: (() => void) | undefined;
    let unsubscribeNotifee: (() => void) | undefined;
    let unsubscribeToken: (() => void) | undefined;

    const setup = async () => {
      await createChannel();

      // ✅ Calls the OS permission directly. 
      // The OS natively shows this popup ONLY on first install.
      const hasPermission = await requestPermission();
      
      if (hasPermission) {
        // Get token and save to storage for RootNavigation to use
        const token = await getFCMToken();
        if (token) {
          await setPrefsValue(STORAGE.FCM_TOKEN, token);
        }
      }

      checkInitialNotification();

      unsubscribeForeground = messaging().onMessage(onForegroundMessage);

      unsubscribeBackground = messaging().onNotificationOpenedApp(
        remoteMessage => {
          console.log('Opened from background', remoteMessage);
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
        console.log('New FCM Token:', token);
        await setPrefsValue(STORAGE.FCM_TOKEN, token);
        await setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, ''); // Force API call
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

// ==========================================
// SETUP FUNCTIONS
// ==========================================
async function createChannel() {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
}

async function requestPermission() {
  await notifee.requestPermission();
  const status = await messaging().requestPermission();
  const enabled =
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL;
  console.log('Notification Permission:', enabled);
  return enabled;
}

async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

// ==========================================
// NOTIFICATION HANDLERS
// ==========================================
async function checkInitialNotification() {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('App opened from KILLED state. Saving notification data...');
    pendingNotificationData = remoteMessage.data;
  }
}

async function onForegroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log('Foreground Message:', remoteMessage);
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? '',
    body: remoteMessage.notification?.body ?? '',
    data: remoteMessage.data,
    android: {
      channelId: CHANNEL_ID,
      pressAction: {id: 'default'},
    },
  });
}

function handleNotification(data?: any) {
  if (!data) return;
  console.log('Notification Data received:', data);

  const token = getPrefsValue(STORAGE.TOKEN);
  if (!token) {
    console.log('User not logged in, skipping navigation');
    return;
  }

  if (data?.type === 'support_chat' && data?.conversationId) {
    const userData = getPrefsValue(STORAGE.USER_DATA);
    let userInfo = null;
    try {
      userInfo = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.log('Error parsing user data', e);
    }

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