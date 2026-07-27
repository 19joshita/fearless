import {MMKV} from 'react-native-mmkv';

export const getPrefsValue = (key: string) => {
  const storage = new MMKV();
  try {
    const data = storage.getString(key);
    if (data !== null) {
      return data;
    }
  } catch (error) {
    console.error('PREFS ERROR', error);
    return undefined;
  }
};

export const setPrefsValue = (key: string, value: any) => {
  const storage = new MMKV();
  try {
    const data = storage.set(key, value);
    if (data !== null) {
      return data;
    }
  } catch (error) {
    console.error('PREFS ERROR', error);
  }
};

export const deleteAllPrefs = async () => {
  const storage = new MMKV();
  try {
    storage.clearAll();
  } catch (error) {
    console.error('PREFS ERROR', error);
  }
};

export const deleteFromPrefs = async (key: string) => {
  const storage = new MMKV();
  try {
    storage.delete(key);
  } catch (error) {
    console.error('PREFS ERROR', error);
  }
};
