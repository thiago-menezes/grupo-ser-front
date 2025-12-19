export type {
  SearchBannerPromoItemDTO,
  SearchBannerPromosResponseDTO,
} from '@/types/api/search-banner-promos';

export type UseSearchBannerPromosParams = {
  institutionSlug: string;
  enabled?: boolean;
};
