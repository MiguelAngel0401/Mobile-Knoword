import { AxiosInstance } from "axios";

export const logout = async (client: AxiosInstance) => {
  try {
    await client.post("/auth/logout", null, {
      headers: {
        "ngrok-skip-browser-warning": "true", // ✅ blindado
      },
    });
  } catch (error) {
    console.error("Backend logout failed:", error);
  }
};