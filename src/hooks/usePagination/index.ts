'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_CARD_WIDTH, DEFAULT_GAP } from './constants';
import type { UsePaginationOptions, PaginationState } from './types';

export function usePagination({
  totalItems,
  containerRef,
  cardWidth = DEFAULT_CARD_WIDTH,
  gap = DEFAULT_GAP,
}: UsePaginationOptions): PaginationState {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isScrollable, setIsScrollable] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const cardTotalWidth = cardWidth + gap;

  useEffect(() => {
    const updateItemsPerPage = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      // Calculate how many items can fit, accounting that the last item doesn't need gap after it
      const calculatedItemsPerPage = Math.max(
        1,
        Math.floor((containerWidth + gap) / cardTotalWidth),
      );

      const calculatedTotalPages = Math.ceil(
        totalItems / calculatedItemsPerPage,
      );
      const scrollable = calculatedTotalPages > 1;

      setItemsPerPage(calculatedItemsPerPage);
      setTotalPages(calculatedTotalPages);
      setIsScrollable(scrollable);
      setCurrentPage(0);
    };

    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateItemsPerPage);
      resizeObserverRef.current.observe(containerRef.current);
    }

    updateItemsPerPage();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, containerRef, cardTotalWidth]);

  const goToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;

    const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
    const firstItemIndex = clampedPage * itemsPerPage;
    const scrollPosition = firstItemIndex * cardTotalWidth;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    setCurrentPage(clampedPage);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    isScrollable,
    goToPage,
  };
}
