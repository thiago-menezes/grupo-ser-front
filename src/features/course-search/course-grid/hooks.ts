import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { useCourseFiltersContext } from '../context';
import { adaptCourseCardToCourseData } from './adapters';
import { useQueryCoursesSearch } from './api/query';
import { ITEMS_PER_PAGE } from './constants';

export const useCourseGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filters } = useCourseFiltersContext();
  const prevFiltersRef = useRef<string>('');

  const modalitiesKey = filters.modalities.join(',');
  const shiftsKey = filters.shifts.join(',');
  const durationsKey = filters.durations.join(',');

  const filtersKey = [
    filters.city,
    modalitiesKey,
    filters.priceRange.min,
    filters.priceRange.max,
    shiftsKey,
    durationsKey,
    filters.courseLevel,
    filters.courseName,
    filters.radius,
  ].join('|');

  useEffect(() => {
    // Reset to page 1 when filters change
    if (prevFiltersRef.current !== filtersKey) {
      prevFiltersRef.current = filtersKey;
      if (currentPage !== 1) {
        startTransition(() => {
          setCurrentPage(1);
        });
      }
    }
  }, [filtersKey, currentPage]);

  const bffQuery = useQueryCoursesSearch(
    {
      city: filters.city,
      modalities:
        filters.modalities.length > 0 ? filters.modalities : undefined,
      shifts: filters.shifts.length > 0 ? filters.shifts : undefined,
      durations: filters.durations.length > 0 ? filters.durations : undefined,
      courseName: filters.courseName || undefined,
    },
    currentPage,
    ITEMS_PER_PAGE,
  );

  const { data: bffResponse, isLoading, isError, error } = bffQuery;

  const courses = useMemo(
    () => bffResponse?.courses.map(adaptCourseCardToCourseData) ?? [],
    [bffResponse],
  );

  const totalPages = bffResponse?.totalPages ?? 0;

  const cardsBeforeBanner = courses.slice(0, 6);
  const cardsAfterBanner = courses.slice(6);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    courses,
    totalPages,
    isLoading,
    isError,
    error,
    cardsBeforeBanner,
    cardsAfterBanner,
    handlePageChange,
    currentPage,
  };
};
