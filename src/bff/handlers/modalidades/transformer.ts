import type { IconNames } from '@/components/icon/types';
import type { StrapiModality, ModalityDTO } from './types';

export function transformModality(strapi: StrapiModality): ModalityDTO {
  return {
    id: strapi.slug,
    title: strapi.nome,
    description: strapi.descricao || '',
    icon: (strapi.icone || 'laptop') as IconNames,
    ctaLabel: strapi.cta_label || 'Veja cursos',
    ctaHref: strapi.cta_link || `/cursos?modalities=${strapi.slug}`,
  };
}
