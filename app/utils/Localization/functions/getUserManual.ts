import {UserManual_DE, UserManual_EN} from '@assets/docs';
import {Image} from 'react-native';

export async function getUserManual(
  lang: Language['code'],
  baseName?: string,
): Promise<string> {
  try {
    const fileMap: Record<Language['code'], any> = {
      en: UserManual_EN,
      de: UserManual_DE,
    };

    const file = fileMap[`${lang}`] ?? fileMap.en;
    const {uri} = Image.resolveAssetSource(file);

    const content = await fetch(uri).then(res => res.text());
    return content;
  } catch (error) {
    console.error('Error loading text file:', error);
    return '';
  }
}
