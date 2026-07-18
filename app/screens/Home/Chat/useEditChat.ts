import {EVENTS} from '@constants';
import {useEditChatMutation} from '@redux/chat-api-slice';
import {Emitter} from '@utils';
import Toast from 'react-native-toast-message';

export const useEditChat = () => {
  const [editChat, mutation] = useEditChatMutation();

  const triggerEditChat = async (
    roomId: string,
    params: EditChatParams['params'],
  ): Promise<EditChatResponse | null> => {
    try {
      const result = await editChat({roomId, params}).unwrap();
      Toast.show({
        text1: result?.message,
        type: 'success',
      });
      // Emitter.emit(EVENTS?.UPDATE_CHAT);
      return result;
    } catch (error) {
      console.error('Edit chat failed:', error);
      return null;
    }
  };

  return {
    editChat: triggerEditChat,
    ...mutation, // includes isLoading, error, data, etc.
  };
};
