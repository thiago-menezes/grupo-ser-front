import { getMediaUrl, slugify } from '@/utils';
import type { StrapiBlock } from '../courses/types-strapi';
import type { StrapiAreaInteresse, AreaInteresseDTO } from './types';

function extractCoursesFromRichText(subareas: StrapiBlock[]): string[] {
  if (!subareas || !Array.isArray(subareas)) {
    return [];
  }

  return subareas
    .filter((block) => block.type === 'paragraph')
    .flatMap((block) =>
      (block.children || [])
        .filter(
          (child: { type: string; text?: string }) =>
            child.type === 'text' && child.text?.trim(),
        )
        .map((child: { text?: string }) => child.text!.trim()),
    );
}

export function transformAreaInteresse(
  strapi: StrapiAreaInteresse,
): AreaInteresseDTO {
  const courseNames = extractCoursesFromRichText(strapi.subareas || []);

  return {
    id: strapi.id,
    documentId: strapi.documentId,
    name: strapi.nome,
    slug: slugify(strapi.nome),
    image: strapi.capa?.url ? getMediaUrl(strapi.capa.url) : null,
    courses: courseNames.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
    })),
  };
}
