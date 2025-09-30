import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
});