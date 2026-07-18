import {
  ICON_CHATS,
  ICON_LANGUAGE,
  ICON_LOCK,
  ICON_MEMBERSHIP,
} from '@assets/icons';
import {navigate} from '@navigation-utils';
import {useAppSelector} from '@redux/reduxHook';
import {useCreateConversationMutation} from '@redux/support-chat-slice';
import {RouteNames, useText} from '@utils';
import Toast from 'react-native-toast-message';

const useProfileMenuData = () => {
  const Profile = useAppSelector(state => state?.app?.userInfo);
  const {TEXT} = useText();
  const [createConversation] = useCreateConversationMutation();

  const handleSupportChat = async () => {
    // 1. CHECK ROLE FIRST: If admin, just navigate immediately
    if (Profile?.role === 'admin') {
      navigate(RouteNames.USER_LIST);
      return;
    }
    try {
      const response = await createConversation().unwrap();
      navigate(RouteNames.SUPPORT_CHAT, {
        mode: 'user',
        conversationId: response.data.conversation_id,
        userName: Profile?.name,
      });
    } catch (error) {
      console.log('Create conversation error:', error);
      Toast.show({
        text1: 'Could not start support chat',
        type: 'error',
      });
    }
  };

  const profileMenu = [
    {
      title: TEXT.CHANGE_PASSWORD,
      icon: ICON_LOCK,
      onPress: () => navigate(RouteNames.CHANGE_PASSWORD),
    },
    {
      title: TEXT.LANGUAGE,
      icon: ICON_LANGUAGE,
      onPress: () => navigate(RouteNames.LANGUAGE),
    },
    {
      title: TEXT.MEMBERSHIP_STATUS,
      icon: ICON_MEMBERSHIP,
      onPress: () => navigate(RouteNames.MEMBERSHIP),
    },
    {
      title: TEXT.SAVED_CHATS,
      icon: ICON_CHATS,
      onPress: () => navigate(RouteNames.SAVED_CHATS),
    },
    {
      title: TEXT.INFORMATION,
      icon: ICON_CHATS,
      onPress: () => navigate(RouteNames.INFORMATION),
    },
    {
      title: TEXT.SUPPORT_CHAT,
      icon: ICON_CHATS,
      onPress: handleSupportChat,
    },
  ];

  return {
    profileMenu,
  };
};

export default useProfileMenuData;
