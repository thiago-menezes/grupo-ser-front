import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type {
  SearchBannerPromosResponseDTO,
  UseSearchBannerPromosParams,
} from './types';

const SEARCH_BANNER_PROMOS_QUERY_KEY = 'search-banner-promos';

export function useQuerySearchBannerPromos({
  institutionSlug,
  enabled = true,
}: UseSearchBannerPromosParams) {
  return useQuery({
    queryKey: [SEARCH_BANNER_PROMOS_QUERY_KEY, institutionSlug],
    queryFn: () =>
      query<SearchBannerPromosResponseDTO>('/search-banner-promos', {
        institutionSlug,
      }),
    enabled: enabled && !!institutionSlug,
  });
}
