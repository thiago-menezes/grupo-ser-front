import Image from 'next/image';
import { View } from 'reshaped';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseImageProps = {
  course: CourseDetails;
};

export function CourseImage({ course }: CourseImageProps) {
  // Use Strapi featuredImage if available, fallback to default

  const imageAlt = course.name || 'Imagem do curso';

  if (!course.featuredImage) {
    return null;
  }

  return (
    <View className={styles.imageContainer}>
      <Image
        src={course.featuredImage}
        alt={imageAlt}
        width={800}
        height={120}
        className={styles.image}
      />
    </View>
  );
}
