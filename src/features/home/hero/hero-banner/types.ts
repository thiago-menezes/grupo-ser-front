import type { CarouselItem } from '../api/query';

export type HeroBannerProps = {
  carouselItems?: CarouselItem[];
  currentSlide?: number;
  direction?: 'left' | 'right';
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  isLoading?: boolean;
};
