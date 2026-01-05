import { getMediaUrl } from '@/utils';
import type { StrapiSearchBannerPromoItem, SearchBannerDTO } from './types';

export function transformSearchBanner(
  strapi: StrapiSearchBannerPromoItem,
): SearchBannerDTO {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    link: strapi.link || null,
    image: strapi.imagem?.url ? getMediaUrl(strapi.imagem.url) : null,
  };
}
