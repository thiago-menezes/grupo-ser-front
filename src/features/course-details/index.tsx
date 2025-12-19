import { useParams } from 'next/navigation';
import { Container, View } from 'reshaped';
import { useCityContext } from '@/contexts/city';
import { useCurrentInstitution, useQueryParams } from '@/hooks';
import { useQueryCourseDetails } from './api/query';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import styles from './styles.module.scss';

export function CourseDetailsPage() {
  const { searchParams, setParam } = useQueryParams();
  const { institutionSlug } = useCurrentInstitution();
  const { courseId } = useParams<{ courseId: string }>();
  const { city: contextCity, state: contextState } = useCityContext();

  const state = searchParams.get('state') || contextState;
  const city = searchParams.get('city') || contextCity;
  const unit = searchParams.get('unit');
  const admissionForm = searchParams.get('admissionForm');

  const {
    data: course,
    isLoading,
    error,
  } = useQueryCourseDetails({
    courseId: courseId || '',
    institution: institutionSlug || undefined,
    state: state || undefined,
    city: city || undefined,
    unit: unit || undefined,
    admissionForm: admissionForm || undefined,
  });

  // Auto-select first unit if not specified and ensure enrollment data loads
  if (course && !unit && course.units.length > 0 && state && city) {
    const firstUnit = course.units[0];
    const unitToUse = firstUnit.originalId || firstUnit.id.toString();
    setParam('unit', unitToUse);
  }

  if (isLoading) {
    return (
      <View className={styles.page}>
        <Container>
          <CourseDetailsSkeleton />
        </Container>
      </View>
    );
  }

  if (error || !course || !courseId) {
    return (
      <View className={styles.page}>
        <Container>
          <View className={styles.error}>
            <h1>
              {!courseId
                ? 'Parâmetro Course ID não encontrado'
                : 'Curso não encontrado'}
            </h1>
            <p>
              {!courseId
                ? 'O parâmetro Course ID é obrigatório para visualizar os detalhes do curso.'
                : 'O curso que você está procurando não foi encontrado.'}
            </p>
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <Container className={styles.topSection}>
        <CourseDetailsContent course={course} />
      </Container>
    </View>
  );
}
