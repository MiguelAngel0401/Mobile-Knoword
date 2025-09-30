import privateApiClient from "../client/privateApiClient";

export const logout = async () => {
  try {
    await privateApiClient.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed:", error);
  }
};