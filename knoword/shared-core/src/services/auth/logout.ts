import { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

export const logout = async (client: AxiosInstance) => {
  try {
    await SecureStore.deleteItemAsync("token");
  } catch (e) {
  }

  try {
    await client.post("/auth/logout", null, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 3000,
    });
  } catch (error) {
  }
};