import publicApiClient from "../client/publicApiClient";
import { RegisterFormData } from "../../types/auth";

export const registerUser = async (data: RegisterFormData) => {
  const response = await publicApiClient.post("/auth/register", data);
  return response.data;
};