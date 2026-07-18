import {store} from '@redux/store';
import {Language, TranslationKeys, translations} from '../Languages';
import type {RootState} from '@redux/store';

export const translate = (key: TranslationKeys, lang?: Language): string => {
  const state: RootState = store?.getState();
  const selectedLang: Language = lang || state?.app?.currentLanguage;

  return translations[selectedLang]?.[key] ?? key;
};
