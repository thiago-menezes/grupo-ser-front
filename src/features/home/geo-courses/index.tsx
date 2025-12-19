import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Button, Text } from 'reshaped';
import { Icon, Pagination, CourseCard } from '@/components';
import { CourseCardSkeleton } from '@/components/course-card/skeleton';
import { useCityContext } from '@/contexts/city';
import { adaptCourseCardToCourseData } from '@/features/course-search/course-grid/adapters';
import {
  useCurrentInstitution,
  useGeolocation,
  useInstitutionData,
  usePagination,
} from '@/hooks';
import { CourseCard as CourseCardType } from '@/types/api/courses-search';
import { useQueryGeoCourses } from './api';
import styles from './styles.module.scss';
import type { GeoCourseSectionProps } from './types';

const SKELETON_COUNT = 5;

export function GeoCoursesSection({ title }: GeoCourseSectionProps) {
  const router = useRouter();
  const { institutionId } = useCurrentInstitution();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    city: contextCity,
    state: contextState,
    focusCityField,
  } = useCityContext();
  const { defaultCity, defaultState } = useInstitutionData();

  const {
    city: geoCity,
    state: geoState,
    permissionDenied,
    requestPermission,
    isLoading,
  } = useGeolocation({
    manualCity: contextCity || null,
    manualState: contextState || null,
    institutionDefaultCity: defaultCity,
    institutionDefaultState: defaultState,
  });

  // Use context city/state if available, otherwise use geolocation result (which includes defaults)
  const city = contextCity || geoCity || '';
  const state = contextState || geoState || '';
  const hasCity = Boolean(city && state);

  const { data: fetchedData, isLoading: isFetching } = useQueryGeoCourses({
    city: city || undefined,
    state: state || undefined,
    enabled: true,
  });

  const showSkeletons = isLoading || isFetching;
  const coursesToShow = showSkeletons ? [] : fetchedData?.courses?.slice(0, 5);

  const { currentPage, totalPages, goToPage, isScrollable } = usePagination({
    totalItems: showSkeletons ? SKELETON_COUNT : coursesToShow?.length || 0,
    containerRef: scrollContainerRef as React.RefObject<HTMLDivElement>,
  });

  const handleScroll = useCallback(
    (_e: React.UIEvent<HTMLDivElement>) => {},
    [],
  );

  const handleCourseClick = useCallback(
    (course: CourseCardType) => {
      if (!institutionId) return;

      const queryParams = new URLSearchParams();

      // Use course data for city/state, fallback to context
      const courseCity = course.city || city;
      const courseState = course.state || state;

      if (courseCity && courseState) {
        queryParams.set('city', courseCity);
        queryParams.set('state', courseState);
      }

      const queryString = queryParams.toString();
      router.push(
        `/${institutionId}/cursos/${course.courseId}${queryString ? `?${queryString}` : ''}`,
      );
    },
    [router, institutionId, city, state],
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Text as="h2" variant="featured-1" weight="bold">
              {title}
            </Text>
            <div className={styles.subtitle}>
              <Text as="span" variant="body-2">
                Cursos perto de você
              </Text>
              {!hasCity && permissionDenied ? (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={requestPermission}
                  disabled={isLoading}
                  className={styles.locationButton}
                >
                  <Icon name="current-location" size={16} />
                  Permitir localização
                </Button>
              ) : (
                hasCity && (
                  <button
                    type="button"
                    onClick={focusCityField}
                    className={styles.locationButton}
                    disabled={isLoading}
                  >
                    <Text as="span" variant="body-2" weight="medium">
                      {city} - {state}
                    </Text>
                    <Icon
                      name="current-location"
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                )
              )}
            </div>
          </div>
          <Link href={`/${institutionId}/cursos`}>
            <Button
              variant="ghost"
              aria-label="Ver todos os cursos disponíveis"
            >
              Ver todos os cursos
            </Button>
          </Link>
        </div>

        <div className={styles.coursesContainer}>
          <div
            ref={scrollContainerRef}
            className={styles.coursesScroll}
            onScroll={handleScroll}
            role="list"
          >
            {showSkeletons
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className={styles.card}
                    role="listitem"
                  >
                    <CourseCardSkeleton />
                  </div>
                ))
              : coursesToShow?.map((course) => (
                  <div key={course.id} className={styles.card} role="listitem">
                    <CourseCard
                      course={adaptCourseCardToCourseData(
                        course as unknown as CourseCardType,
                      )}
                      onClick={(course) =>
                        handleCourseClick(course as unknown as CourseCardType)
                      }
                    />
                  </div>
                ))}
          </div>

          {isScrollable && !showSkeletons && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={goToPage}
            />
          )}
        </div>
      </div>
    </section>
  );
}
