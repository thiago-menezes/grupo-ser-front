import { getStrapiBaseUrl } from '../../services/strapi';
import type { MediaQueryParams } from './types';

export async function handleMedia(
  params: MediaQueryParams,
): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const mediaPath = `/${params.path.join('/')}`;
  const strapiBaseUrl = getStrapiBaseUrl();
  const strapiMediaUrl = `${strapiBaseUrl}${mediaPath}`;

  const response = await fetch(strapiMediaUrl, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status}`);
  }

  const contentType =
    response.headers.get('content-type') || 'application/octet-stream';
  const buffer = await response.arrayBuffer();

  return { buffer, contentType };
}
