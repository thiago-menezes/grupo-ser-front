import { getMediaUrl } from '@/utils';
import type { StrapiEMecItem, EMecDTO } from './types';

export function transformEMec(strapi: StrapiEMecItem): EMecDTO {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    link: strapi.link || null,
    qrCode: strapi.qrcode?.url ? getMediaUrl(strapi.qrcode.url) : null,
  };
}
