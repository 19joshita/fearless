import {
  getLocales,
  getCountry,
  getTimeZone,
  getCurrencies,
} from 'react-native-localize';

export const getDeviceLocaleInfo = () => {
  const locales = getLocales();
  const primaryLocale = locales[0];

  return {
    // Language
    language: primaryLocale?.languageCode ?? 'en', // "de"
    languageTag: primaryLocale?.languageTag ?? 'en-US', // "de-DE"
    // Country / Region
    country: primaryLocale?.countryCode ?? getCountry(), // "DE"

    // Full fallback list (if needed)
    locales,
  };
};
