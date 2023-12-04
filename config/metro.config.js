// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defualtConfig = getDefaultConfig(__dirname);
defualtConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;
