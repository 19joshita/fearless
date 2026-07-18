// import RNFS from 'react-native-fs';
// import { Platform } from 'react-native';

// // Define all supported language codes (extend as needed)
// type LanguageCode = 'en' | 'de' | 'fr' | 'es';

// /**
//  * Reads a localized text file (e.g., User Manual) from the native app bundle.
//  *
//  * 🧠 HOW IT WORKS:
//  * - Uses react-native-fs to read .txt files directly from the app’s bundled assets.
//  * - Works 100% offline (no fetch or URI).
//  * - You must manually place the text files in correct native asset folders (see below).
//  *
//  * 📍 FILE PLACEMENT REQUIRED:
//  *
//  * ➤ Android:
//  *   Place your text files in:
//  *   android/app/src/main/assets/texts/
//  *   Example:
//  *     android/app/src/main/assets/texts/UserManual_EN.txt
//  *     android/app/src/main/assets/texts/UserManual_DE.txt
//  *
//  * ➤ iOS:
//  *   Place your text files in:
//  *   ios/<YourProjectName>/Resources/texts/
//  *   Then add them to Xcode:
//  *     - Right click project → “Add Files to <YourProjectName>...”
//  *     - Check “Copy items if needed” ✅
//  *     - Ensure they’re added to your app target ✅
//  *
//  * After that, RNFS can access them directly at runtime.
//  */
// export async function getUserManual(lang: LanguageCode): Promise<string> {
//   try {
//     // 🗺️ Map each supported language to its corresponding file name
//     const fileMap: Record<LanguageCode, string> = {
//       en: 'UserManual_EN.txt',
//       de: 'UserManual_DE.txt',
//       fr: 'UserManual_FR.txt',
//       es: 'UserManual_ES.txt',
//     };

//     // 🎯 Pick correct file name, defaulting to English if language is missing
//     const fileName = fileMap[lang] || fileMap.en;

//     // 📂 Build platform-specific file path
//     // - On iOS → files go inside MainBundlePath (Xcode Resources)
//     // - On Android → files go inside /android/app/src/main/assets/
//     const path =
//       Platform.OS === 'ios'
//         ? `${RNFS.MainBundlePath}/texts/${fileName}` // iOS bundle path
//         : `bundle-assets://texts/${fileName}`; // Android bundle URI

//     console.log('Reading user manual from:', path);

//     // 📖 Read file content as UTF-8 text
//     const content = await RNFS.readFile(path, 'utf8');

//     // ✅ Return the loaded text
//     return content;
//   } catch (error) {
//     // ⚠️ Handle and log any read errors gracefully
//     console.warn('Error loading user manual:', error);

//     // Return fallback message to avoid UI breaking
//     return 'Sorry, the user manual could not be loaded.';
//   }
// }
