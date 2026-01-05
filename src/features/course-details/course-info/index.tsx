import { Text, View } from 'reshaped';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseInfoProps = {
  course: CourseDetails;
  onViewCurriculum: () => void;
};

export function CourseInfo({ course, onViewCurriculum }: CourseInfoProps) {
  return (
    <View className={styles.info}>
      <View className={styles.header}>
        <View className={styles.titleSection}>
          <Text
            as="h1"
            variant="featured-1"
            weight="bold"
            className={styles.title}
          >
            {course.name}
          </Text>
          {course.institution && (
            <View className={styles.meta}>
              <Text variant="body-3" color="neutral-faded">
                {course.institution.name}
              </Text>
            </View>
          )}
        </View>
        {!!course.curriculumGrid && (
          <button
            type="button"
            onClick={onViewCurriculum}
            className={styles.curriculumButton}
          >
            Ver grade curricular
          </button>
        )}
      </View>
    </View>
  );
}
