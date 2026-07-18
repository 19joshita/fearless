module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@components': './app/components',
          '@global-components': './app/components/global',
          '@assets': './app/assets',
          '@navigation': './app/navigation',
          '@navigation-utils': './app/navigation/utils',
          '@navigation-stacks': './app/navigation/stacks',
          '@theme': './app/theme',
          '@utils': './app/utils',
          '@constants': './app/utils/constants',
          '@screens': './app/screens',
          '@redux': './app/redux',
          '@localization': './app/utils/Localization'
        },
      },
    ],
    'react-native-reanimated/plugin', // ⬅️ Must be last and standalone
  ],
};
