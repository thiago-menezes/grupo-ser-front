import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Pagination } from '@/components/pagination';
import { getMediaUrl } from '@/packages/utils';
import { usePromotionalBanners } from './api';
import type { PromotionalBannerItemDTO } from './api/types';
import { useScrollPagination } from './hooks';
import styles from './styles.module.scss';

export type PromotionalBannersProps = {
  institutionSlug: string;
};

// Banner card dimensions matching the SCSS
const BANNER_GAP = 24;

export function PromotionalBanners({
  institutionSlug,
}: PromotionalBannersProps) {
  const { data: bannersResponse, isLoading } =
    usePromotionalBanners(institutionSlug);
  const banners = (bannersResponse?.data ?? []).filter(
    (banner): banner is PromotionalBannerItemDTO & { imageUrl: string } =>
      Boolean(banner.imageUrl),
  );
  const [cardWidth, setCardWidth] = useState(294); // Default mobile width

  // Update card width based on window size
  useEffect(() => {
    const updateCardWidth = () => {
      setCardWidth(window.innerWidth >= 440 ? 394 : 294);
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const { scrollerRef, currentPage, totalPages, handlePageChange } =
    useScrollPagination({
      totalItems: banners.length,
      itemWidth: cardWidth,
      gap: BANNER_GAP,
    });

  if (isLoading || !banners.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-label="Banners promocionais">
      <div className={styles.container}>
        <div className={styles.scroller} role="list" ref={scrollerRef}>
          {banners.map((banner) => {
            const imageElement = (
              <Image
                src={getMediaUrl(banner.imageUrl)}
                alt={banner.imageAlt || 'Banner promocional'}
                className={styles.bannerImage}
                priority
                width={200}
                height={190}
              />
            );

            return (
              <article
                key={banner.id}
                className={styles.bannerCard}
                role="listitem"
              >
                {banner.link ? (
                  <Link
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.bannerLink}
                  >
                    {imageElement}
                  </Link>
                ) : (
                  imageElement
                )}
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChangeAction={handlePageChange}
            className={styles.pagination}
          />
        )}
      </div>
    </section>
  );
}
