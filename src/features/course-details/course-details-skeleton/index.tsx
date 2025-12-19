import { Skeleton, View } from 'reshaped';
import styles from './styles.module.scss';

export function CourseDetailsSkeleton() {
  return (
    <View className={styles.skeleton}>
      <Skeleton className={styles.breadcrumbSkeleton} />
      <Skeleton className={styles.imageSkeleton} />
      <Skeleton className={styles.titleSkeleton} />
      <Skeleton className={styles.infoSkeleton} />
      <Skeleton className={styles.modalitySkeleton} />
      <Skeleton className={styles.admissionSkeleton} />
      <Skeleton className={styles.aboutSkeleton} />
    </View>
  );
}
