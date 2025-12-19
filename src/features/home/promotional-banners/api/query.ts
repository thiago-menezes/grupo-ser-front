import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type { PromotionalBannersResponseDTO } from './types';

const HOME_PROMO_BANNERS_QUERY_KEY = ['home', 'promo-banners'];

export function usePromotionalBanners(institutionSlug: string) {
  return useQuery({
    queryKey: [...HOME_PROMO_BANNERS_QUERY_KEY, institutionSlug],
    queryFn: () =>
      query<PromotionalBannersResponseDTO>('/home-promotional-banners', {
        institutionSlug,
      }),
  });
}
