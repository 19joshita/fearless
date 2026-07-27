import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

export const getPrefsValue = (key: string): string | undefined => {
  try {
    return storage.getString(key) ?? undefined;
  } catch (error) {
    console.error('PREFS ERROR [GET]', error);
    return undefined;
  }
};

export const setPrefsValue = (key: string, value: string | number | boolean) => {
  try {
    storage.set(key, value);
  } catch (error) {
    console.error('PREFS ERROR [SET]', error);
  }
};

export const deleteAllPrefs = () => {
  try {
    storage.clearAll();
  } catch (error) {
    console.error('PREFS ERROR [CLEAR ALL]', error);
  }
};

export const deleteFromPrefs = (key: string) => {
  try {
    storage.delete(key);
  } catch (error) {
    console.error('PREFS ERROR [DELETE]', error);
  }
};

