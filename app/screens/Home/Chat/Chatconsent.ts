import {STORAGE} from '@constants';
import {getPrefsValue, setPrefsValue} from '@utils';
import {Alert, Platform} from 'react-native';

export const checkAIConsent = async () => {
  if (Platform.OS !== 'ios') return true;
  const consent = getPrefsValue(STORAGE.CONSENT) === 'true';
  console.log('consent value ', consent);

  return new Promise(resolve => {
    Alert.alert(
      'AI Data Usage Permission',
      'To generate AI responses, your messages will be securely sent to OpenAI. We do not store or sell your personal data. Do you allow this?',
      [
        {
          text: "Don't Allow",
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'Allow',
          onPress: async () => {
            setPrefsValue(STORAGE.CONSENT, 'true');
            setTimeout(() => {
              resolve(true);
            }, 100);
          },
        },
      ],
      {cancelable: false},
    );
  });

  return true;
};
