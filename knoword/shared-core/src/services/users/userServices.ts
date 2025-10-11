import { AxiosInstance } from "axios";
import { ProfileFormData, UserProfileResponse } from "../../../../shared-core/src/types/users";

export const getMe = async (
  client: AxiosInstance
): Promise<UserProfileResponse> => {
  try {
    const response = await client.get<UserProfileResponse>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserData = async (
  client: AxiosInstance,
  data: ProfileFormData
): Promise<UserProfileResponse> => {
  try {
    const response = await client.patch<UserProfileResponse>("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};