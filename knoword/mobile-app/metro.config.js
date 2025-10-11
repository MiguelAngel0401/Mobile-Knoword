const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, "../shared-core");

const config = getDefaultConfig(projectRoot);

// Asegura que Metro observe shared-core
config.watchFolders = [sharedRoot];

// Fuerza resolución de módulos compartidos desde mobile-app
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  axios: path.resolve(projectRoot, "node_modules/axios"),
  zod: path.resolve(projectRoot, "node_modules/zod"),
  zustand: path.resolve(projectRoot, "node_modules/zustand"),
  "@shared": path.resolve(sharedRoot, "src"),
};

// Asegura que las extensiones se resuelvan bien
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg", "ts", "tsx"];

module.exports = config;