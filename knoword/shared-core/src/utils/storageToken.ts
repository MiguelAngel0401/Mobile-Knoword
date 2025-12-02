import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const storage = isExpoGo
  ? require("./storageToken.native.dev") 
  : require("./storageToken.native");  

export const saveTokens = storage.saveTokens;
export const getTokens = storage.getTokens;
export const clearTokens = storage.clearTokens;