import publicApiClient from "../client/publicApiClient";

export const confirmEmail = async (token: string) => {
  const response = await publicApiClient.get(`/auth/confirm-email?token=${token}`);
  return response.data;
};