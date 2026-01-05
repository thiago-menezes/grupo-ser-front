'use client';

import { Text, View } from 'reshaped';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseEnrollmentSidebarProps = {
  course: CourseDetails;
};

export function CourseEnrollmentSidebar({
  course,
}: CourseEnrollmentSidebarProps) {
  // Simplified sidebar - enrollment functionality removed as data comes from another API
  return (
    <View className={styles.sidebar}>
      <View className={styles.card}>
        <View className={styles.header}>
          <Text
            as="h3"
            variant="body-3"
            weight="medium"
            className={styles.title}
          >
            {course.name}
          </Text>
        </View>
        {course.institution && (
          <View className={styles.form}>
            <Text variant="body-3" color="neutral-faded">
              {course.institution.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
