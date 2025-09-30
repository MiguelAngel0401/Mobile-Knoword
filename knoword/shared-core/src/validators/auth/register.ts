import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
  username: z
    .string()
    .min(3, "Tu nombre de usuario debe tener al menos 3 caracteres.")
    .max(20, "Tu nombre de usuario no puede tener más de 20 caracteres."),
  realName: z
    .string()
    .min(3, "Tu nombre real debe tener al menos 3 caracteres.")
    .max(50, "Tu nombre real no puede tener más de 50 caracteres."),
  bio: z
    .string()
    .max(160, "Tu biografía no puede tener más de 160 caracteres.")
    .optional(),
  avatar: z.string().optional(),
});