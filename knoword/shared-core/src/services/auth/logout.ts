import { AxiosInstance } from "axios";

export const logout = async (client: AxiosInstance) => {
  try {
    await client.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed:", error);
  }
};