import { useEffect, useRef } from 'react';
import { Button } from 'reshaped';
import { Icon } from '@/components';
import styles from './styles.module.scss';
import type { CarouselControlsProps } from './types';

export function CarouselControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  onToggleAutoAdvance,
  showArrows = true,
}: CarouselControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrevious();
        onToggleAutoAdvance?.(false);
      } else if (e.key === 'ArrowRight') {
        onNext();
        onToggleAutoAdvance?.(false);
      }
    };

    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [onPrevious, onNext, onToggleAutoAdvance]);

  if (totalSlides <= 1) return null;

  return (
    <div className={styles.container} ref={containerRef}>
      {showArrows && (
        <>
          <Button
            className={styles.arrowButton}
            onClick={() => {
              onPrevious();
              onToggleAutoAdvance?.(false);
            }}
            aria-label="Previous slide (or press ← arrow)"
            icon={<Icon name="chevron-left" size={20} />}
          />
        </>
      )}

      <div className={styles.indicators}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => {
              onGoToSlide?.(index);
              onToggleAutoAdvance?.(false);
            }}
            aria-label={`Go to slide ${index + 1}`}
            title={`Slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {showArrows && (
        <Button
          className={styles.arrowButton}
          onClick={() => {
            onNext();
            onToggleAutoAdvance?.(false);
          }}
          aria-label="Next slide (or press → arrow)"
          icon={<Icon name="chevron-right" size={24} />}
        />
      )}
    </div>
  );
}

export type { CarouselControlsProps };
