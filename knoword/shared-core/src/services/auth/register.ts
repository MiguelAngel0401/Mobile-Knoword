import publicApiClient from "../client/publicApiClient";

export const checkEmail = async (email: string) => {
  const response = await publicApiClient.post("/auth/check-email", { email });
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await publicApiClient.post("/auth/check-username", { username });
  return response.data;
};

export const registerUser = async (data: {
  email: string;
  password: string;
  username: string;
  realName: string;
  bio?: string;
  avatar?: string;
}) => {
  const response = await publicApiClient.post("/auth/register", data);
  return response.data;
};