import { Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export const CourseCardSkeleton = () => (
  <div className={`${styles.card} ${styles.skeletonCard}`}>
    <div className={styles.header}>
      <Skeleton width="40%" height={4} />
      <Skeleton width="90%" height={5} />
      <div className={styles.meta}>
        <Skeleton width={24} height={4} />
        <Skeleton width={28} height={4} />
      </div>
    </div>

    <div className={styles.modalities}>
      <Skeleton width="30%" height={4} />
      <div className={styles.modalitiesList}>
        <Skeleton width={20} height={6} borderRadius="small" />
        <Skeleton width={24} height={6} borderRadius="small" />
      </div>
    </div>

    <div className={styles.priceSection}>
      <Skeleton width="35%" height={4} />
      <Skeleton width="50%" height={7} />
    </div>

    <div className={styles.locationWrapper}>
      <Skeleton width="60%" height={4} />
      <Skeleton width="70%" height={4} />
    </div>

    <Skeleton height={9} width="100%" borderRadius="medium" />
  </div>
);
