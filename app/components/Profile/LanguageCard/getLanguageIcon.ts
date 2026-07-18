import {ICON_ENGLISH, ICON_GERMAN} from '@assets/icons';

const getLanguageIcon = (languageCode: string) => {
  switch (languageCode) {
    case 'en':
      return ICON_ENGLISH;
    case 'de':
      return ICON_GERMAN;
    default:
      return ICON_ENGLISH;
  }
};

export default getLanguageIcon;
