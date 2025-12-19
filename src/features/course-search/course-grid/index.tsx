import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pagination, View } from 'reshaped';
import type { CourseData } from 'types/api/courses';
import { CourseCard } from '@/components';
import { CourseCardSkeleton } from '@/components/course-card/skeleton';
import { useCurrentInstitution } from '@/hooks';
import { getMediaUrl } from '@/packages/utils';
import { useQuerySearchBannerPromos } from '../banner-promo/api/query';
import { useCourseGrid } from './hooks';
import styles from './styles.module.scss';

export function CourseGrid() {
  const router = useRouter();
  const { institutionSlug } = useCurrentInstitution();
  const {
    totalPages,
    isLoading,
    isError,
    cardsBeforeBanner,
    cardsAfterBanner,
    handlePageChange,
    currentPage,
  } = useCourseGrid();
  const { data: bannerData, isLoading: isBannerLoading } =
    useQuerySearchBannerPromos({
      institutionSlug,
      enabled: !!institutionSlug,
    });
  const bannerItem = bannerData?.data?.[0];

  const handleCourseClick = (course: CourseData) => {
    const queryParams = new URLSearchParams();

    if (course.campusCity) {
      queryParams.set('city', course.campusCity);
    }

    if (course.campusState) {
      queryParams.set('state', course.campusState);
    }

    if (course.unitId) {
      queryParams.set('unit', course.unitId.toString());
    }

    if (course.admissionForm) {
      queryParams.set('admissionForm', course.admissionForm);
    }

    const queryString = queryParams.toString();
    const url = `/${institutionSlug}/cursos/${course.id}${queryString ? `?${queryString}` : ''}`;

    router.push(url);
  };

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <View gap={4} wrap direction="row" align="center" justify="center">
          {[...Array(3)].map((_, idx) => (
            <CourseCardSkeleton key={idx} />
          ))}
        </View>
      ) : (
        !isError &&
        !isLoading && (
          <>
            <View gap={4} wrap direction="row" align="center" justify="center">
              {cardsBeforeBanner.map((course) => (
                <CourseCard
                  course={course}
                  onClick={handleCourseClick}
                  key={course.id}
                />
              ))}
            </View>

            {bannerItem?.imageUrl && !isBannerLoading && (
              <View className={styles.bannerContainer}>
                <Link
                  href={bannerItem?.link ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={getMediaUrl(bannerItem.imageUrl)}
                    alt={bannerItem?.imageAlt ?? 'Banner'}
                    fill
                  />
                </Link>
              </View>
            )}

            <View gap={4} wrap direction="row" align="center" justify="center">
              {cardsAfterBanner.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </View>
          </>
        )
      )}

      {totalPages > 1 && (
        <View align="center">
          <Pagination
            total={totalPages}
            previousAriaLabel="Página anterior"
            nextAriaLabel="Próxima página"
            pageAriaLabel={(args) => `Página ${args.page}`}
            onChange={(args) => handlePageChange(args.page)}
            defaultPage={currentPage}
          />
        </View>
      )}
    </div>
  );
}
