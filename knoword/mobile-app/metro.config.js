const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, "../shared-core");

const config = getDefaultConfig(projectRoot);

// Observa la carpeta compartida
config.watchFolders = [sharedRoot];

// Extiende en lugar de sobrescribir
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@shared": path.resolve(sharedRoot, "src"),
};

// Manejo de SVG
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = config;