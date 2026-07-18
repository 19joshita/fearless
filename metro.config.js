const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Get the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Enable Reanimated's inline requires
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
    enableBabelRCLookup: true, // Ensure Reanimated's Babel plugin is respected
    experimentalImportSupport: false,
  },
  resolver: { 
    // add support for txt files as well here
    assetExts: assetExts.filter(ext => ext !== 'svg').concat(['txt']),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);

