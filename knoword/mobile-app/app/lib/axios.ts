import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendUrl } from "../../../shared-core/src/config";

const client = axios.create({
  baseURL: getBackendUrl(),
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;