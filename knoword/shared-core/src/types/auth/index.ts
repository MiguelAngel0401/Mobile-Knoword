import { z } from "zod";
import { loginSchema } from "../../validators/auth/login";
import { registerSchema } from "../../validators/auth/register";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterPayload = RegisterFormData & {
  avatar?: string;
};