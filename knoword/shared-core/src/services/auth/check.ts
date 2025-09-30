import publicApiClient from "../client/publicApiClient";

export const checkEmail = async (email: string) => {
  const response = await publicApiClient.get(`/auth/check-email?email=${email}`);
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await publicApiClient.get(`/auth/check-username?username=${username}`);
  return response.data;
};