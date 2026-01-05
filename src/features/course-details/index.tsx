'use client';

import { useParams } from 'next/navigation';
import { Container, View } from 'reshaped';
import { useQueryCourseDetails } from './api/query';
import { CourseDetailsContent } from './course-details-content';
import { CourseDetailsSkeleton } from './course-details-skeleton';
import styles from './styles.module.scss';

export function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const {
    data: course,
    isLoading,
    error,
  } = useQueryCourseDetails({
    courseId: courseId || '',
  });

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
