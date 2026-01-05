import { getMediaUrl } from '@/utils';
import type { StrapiHomePromoBannerItem, BannerDTO } from './types';

export function transformBanner(strapi: StrapiHomePromoBannerItem): BannerDTO {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    link: strapi.link || null,
    image: strapi.imagem?.url ? getMediaUrl(strapi.imagem.url) : null,
  };
}
