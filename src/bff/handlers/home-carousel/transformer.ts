import { getMediaUrl } from '@/utils';
import type { StrapiHomeCarouselItem, CarouselItemDTO } from './types';

export function transformCarouselItem(
  strapi: StrapiHomeCarouselItem,
): CarouselItemDTO {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    name: strapi.nome,
    link: strapi.link || null,
    image: strapi.imagem?.url ? getMediaUrl(strapi.imagem.url) : null,
  };
}
