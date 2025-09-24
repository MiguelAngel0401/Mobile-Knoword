import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateTags(tags: string[]): Promise<Tag[]> {
    // Normalizar y obtener nombres de etiquetas únicos, todos en minúsculas para garantizar consistencia.
    const uniqueNormalizedTags = [
      ...new Set(tags.map((tag) => tag.toLowerCase().trim())),
    ];

    // Paso 1: Buscar etiquetas existentes.
    // Usamos un Set para una búsqueda más eficiente de los nombres de las etiquetas existentes.
    const existingTags = await this.prisma.tag.findMany({
      where: {
        name: {
          in: uniqueNormalizedTags,
        },
      },
    });
    const existingTagNames = new Set(existingTags.map((tag) => tag.name));

    // Paso 2: Identificar las etiquetas nuevas.
    const newTagNames = uniqueNormalizedTags.filter(
      (tagName) => !existingTagNames.has(tagName),
    );

    // Paso 3: Crear las etiquetas nuevas si es que hay alguna.
    if (newTagNames.length > 0) {
      await this.prisma.tag.createMany({
        data: newTagNames.map((name) => ({ name })),
        skipDuplicates: true, // Evita errores si una etiqueta se crea concurrentemente.
      });
    }

    // Paso 4: Devolver todas las etiquetas (existentes y nuevas).
    // La forma más sencilla y segura es volver a consultar todas las etiquetas solicitadas.
    return this.prisma.tag.findMany({
      where: {
        name: {
          in: uniqueNormalizedTags,
        },
      },
    });
  }

  async findRecommendations(tag: string): Promise<Tag[]> {
    const recommendations = await this.prisma.tag.findMany({
      where: {
        name: {
          startsWith: tag,
          mode: 'insensitive',
        },
      },
      take: 5,
      orderBy: {
        name: 'asc',
      },
    });
    return recommendations;
  }
}
