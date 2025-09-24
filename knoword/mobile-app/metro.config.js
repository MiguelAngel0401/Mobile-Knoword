const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 👇 Asegura que Metro reconozca imágenes como assets
config.resolver.assetExts.push('png');

// 👇 Mantiene tu alias personalizado
config.resolver.extraNodeModules = {
  '@shared': path.resolve(__dirname, '../shared-core/src'),
};

// 👇 Asegura que Metro observe los cambios en shared-core
config.watchFolders = [path.resolve(__dirname, '../shared-core')];

module.exports = config;