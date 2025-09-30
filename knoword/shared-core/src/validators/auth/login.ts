import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
});