import { Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export function HeroBannerSkeleton() {
  return (
    <div className={styles.container}>
      <Skeleton className={styles.skeleton} />
    </div>
  );
}
