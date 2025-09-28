const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png');

// Mantener tu configuración actual
config.resolver.extraNodeModules = {
  '@shared': path.resolve(__dirname, '../shared-core/src'),
};

config.watchFolders = [path.resolve(__dirname, '../shared-core')];

module.exports = config;