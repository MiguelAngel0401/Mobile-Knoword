import { z } from "zod";

/**
 * Esquema de validación para la creación de comunidades
 * IMPORTANTE: Sincronizado con CreateCommunityDto del backend
 */
export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(50, "El título no puede tener más de 50 caracteres."),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  isPrivate: z.boolean(),
  tags: z
    .array(
      z.string()
        .min(3, "Cada etiqueta debe tener al menos 3 caracteres.")
        .max(50, "Cada etiqueta no puede tener más de 50 caracteres.")
    )
    .min(3, "Debes agregar al menos 3 etiquetas.")
    .max(5, "No puedes agregar más de 5 etiquetas."),
  banner: z.string().url("El banner debe ser una URL válida").optional(),
  avatar: z.string().url("El avatar debe ser una URL válida").optional(),
});

export const validateCreateCommunity = (data: unknown) => {
  return createCommunitySchema.parse(data);
};