const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, "../shared-core");

const config = getDefaultConfig(projectRoot);

// ✅ Agrega shared-core sin romper las carpetas internas de Metro
config.watchFolders = [...config.watchFolders, sharedRoot];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "react-native-keychain": path.resolve(projectRoot, "node_modules/react-native-keychain"),
  "expo-secure-store": path.resolve(projectRoot, "node_modules/expo-secure-store"),
  "expo-constants": path.resolve(projectRoot, "node_modules/expo-constants"),
  "@react-native-async-storage/async-storage": path.resolve(
    projectRoot,
    "node_modules/@react-native-async-storage/async-storage"
  ), // ✅ agregado para evitar el error
  axios: path.resolve(projectRoot, "node_modules/axios"),
  zod: path.resolve(projectRoot, "node_modules/zod"),
  zustand: path.resolve(projectRoot, "node_modules/zustand"),
  "@shared": path.resolve(sharedRoot, "src"),
};

// ✅ Manejo de SVGs
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = config;