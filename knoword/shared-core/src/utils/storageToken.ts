import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const storage = isExpoGo
  ? require("./storageToken.native.dev") // ✅ SecureStore en Expo Go
  : require("./storageToken.native");    // ✅ Keychain en builds reales

export const saveTokens = storage.saveTokens;
export const getTokens = storage.getTokens;
export const clearTokens = storage.clearTokens;