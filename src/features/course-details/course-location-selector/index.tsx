import { Skeleton, Text, View } from 'reshaped';
import type { CourseUnitDTO } from '@/types/api/course-details';
import styles from './styles.module.scss';

export type CourseLocationSelectorProps = {
  unit: CourseUnitDTO;
  isLoading?: boolean;
};

export function CourseLocationSelector({
  unit,
  isLoading,
}: CourseLocationSelectorProps) {
  if (isLoading) {
    return (
      <View className={styles.card}>
        <Skeleton width="60%" height={6} />
        <View className={styles.unitCard}>
          <Skeleton width="80%" height={5} />
          <Skeleton width="50%" height={4} />
        </View>
      </View>
    );
  }

  return (
    <View className={styles.card}>
      <Text
        as="h3"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Onde você vai estudar
      </Text>
      <View className={styles.unitCard}>
        <Text variant="body-2" weight="bold" className={styles.unitName}>
          {unit.name}
        </Text>
        <Text
          variant="body-3"
          color="neutral-faded"
          className={styles.unitLocation}
        >
          {unit.city} - {unit.state}
        </Text>
      </View>
    </View>
  );
}
