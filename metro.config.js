const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    "notion-to-md/build/utils/notion.js": require.resolve("notion-to-md"),
  };

module.exports = withNativeWind(config, { input: './global.css' });
