import en from './English';
import de from './German';

export const translations = {en, de};
export type TranslationKeys = keyof typeof en;
export const languageList = ['en', 'de'] as const;
export type Language = (typeof languageList)[number];
