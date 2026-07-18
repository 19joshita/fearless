import {RootState} from '@redux/store';
import {useSelector} from 'react-redux';
import {TranslationKeys, translations} from '../Languages';

export const useText = () => {
  const selectedLanguage = useSelector(
    (state: RootState) => state.app.currentLanguage,
  );
  const translationSet = translations[selectedLanguage] ?? translations.en;

  const TEXT = new Proxy({} as Record<TranslationKeys, string>, {
    get(_, key: string) {
      return translationSet[key as TranslationKeys] ?? key;
    },
  });
  const t = (key: TranslationKeys) => TEXT[key];

  return {TEXT, t};
};
