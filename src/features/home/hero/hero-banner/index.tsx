import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getMediaUrl } from '@/packages/utils';
import styles from './styles.module.scss';
import type { HeroBannerProps } from './types';

export function HeroBanner({
  carouselItems,
  currentSlide = 0,
  direction = 'right',
  imageUrl,
  imageAlt = 'Hero banner',
}: HeroBannerProps) {
  const isInitialMount = useRef(true);
  const prevSlideRef = useRef<number | null>(null);
  const [animatingSlides, setAnimatingSlides] = useState<Set<number>>(
    new Set(),
  );

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSlideRef.current = currentSlide;
      return;
    }

    // Only animate if slide actually changed
    const prevSlide = prevSlideRef.current;
    if (prevSlide !== null && prevSlide !== currentSlide) {
      // Both current and previous slides should animate

      setAnimatingSlides(new Set([currentSlide, prevSlide]));
    }

    prevSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Reset animation flags after animation completes
  useEffect(() => {
    if (animatingSlides.size === 0) return;

    const timer = setTimeout(() => {
      setAnimatingSlides(new Set());
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, [animatingSlides]);

  // Use carousel if items are provided, otherwise fallback to single image
  const useCarousel = carouselItems && carouselItems.length > 0;

  if (useCarousel) {
    return (
      <div className={styles.container}>
        <div className={styles.slidesWrapper}>
          {carouselItems.map((item, index) => {
            const isActive = index === currentSlide % carouselItems.length;
            const shouldAnimate = animatingSlides.has(index);
            const slideDirectionClass =
              direction === 'right' ? styles.slideRight : styles.slideLeft;

            const imageElement = (
              <Image
                src={getMediaUrl(item.image)}
                alt={item.alt || `Hero banner ${index + 1}`}
                fill
                className={styles.image}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1440px"
              />
            );

            return (
              <div
                key={index}
                className={clsx(
                  styles.slide,
                  isActive && styles.slideActive,
                  slideDirectionClass,
                  shouldAnimate && styles.slideAnimated,
                )}
              >
                {item.link ? (
                  <Link
                    href={item.link}
                    target="_blank"
                    className={styles.imageLink}
                    rel="noopener noreferrer"
                  >
                    {imageElement}
                  </Link>
                ) : (
                  imageElement
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback to single image (backward compatibility)
  if (!imageUrl) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Image
        src={getMediaUrl(imageUrl)}
        alt={imageAlt}
        fill
        className={styles.image}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1440px"
      />
    </div>
  );
}

export type { HeroBannerProps };
