import publicApiClient from "../client/publicApiClient";
//import { LoginFormData } from "@shared-core/types/auth";
import { LoginFormData } from "../../types/auth";

export const login = async (credentials: LoginFormData) => {
  await publicApiClient.post("/auth/login", credentials);
};