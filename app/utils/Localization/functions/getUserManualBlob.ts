import ReactNativeBlobUtil from 'react-native-blob-util';
import {Platform} from 'react-native';

// Supported language codes
type LanguageCode = 'en' | 'de' | 'fr' | 'es';

/**
 * Reads a localized .txt file from the app's bundled assets
 * using react-native-blob-util.
 *
 * 🧠 NOTES:
 * - Works 100% offline.
 * - Can also handle remote URLs (e.g., https://example.com/manual.txt).
 * - Requires placing text files in native asset folders (see below).
 *
 * 📍 File Placement:
 *   Android → android/app/src/main/assets/texts/
 *   iOS → ios/<AppName>/Resources/texts/
 */
export async function getUserManual(lang: LanguageCode): Promise<string> {
  try {
    const fileMap: Record<LanguageCode, string> = {
      en: 'UserManual_EN.txt',
      de: 'UserManual_DE.txt',
      fr: 'UserManual_FR.txt',
      es: 'UserManual_ES.txt',
    };

    const fileName = fileMap[lang] || fileMap.en;

    // Platform-specific paths:
    const path =
      Platform.OS === 'ios'
        ? `${ReactNativeBlobUtil.fs.dirs.MainBundleDir}/texts/${fileName}` // iOS Resources
        : `bundle-assets://texts/${fileName}`; // Android Assets

    console.log('Reading file from:', path);

    // ⚡ Read file as UTF-8 text
    const content = await ReactNativeBlobUtil.fs.readFile(path, 'utf8');

    return content;
  } catch (err) {
    console.warn('Error loading user manual via BlobUtil:', err);
    return 'Unable to load user manual.';
  }
}
