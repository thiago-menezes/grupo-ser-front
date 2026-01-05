'use client';

import { View } from 'reshaped';
import { Breadcrumb } from '@/components';
import { CourseAbout } from '../course-about';
import { CourseCoordination } from '../course-coordination';
import { CourseImage } from '../course-image';
import { CourseInfo } from '../course-info';
import { CourseTextSection } from '../course-text-section';
import { CurriculumGridModal } from '../curriculum-grid-modal';
import type { CourseDetails } from '../types';
import { useCourseDetailsContent } from './hooks';
import styles from './styles.module.scss';

export function CourseDetailsContent({ course }: { course: CourseDetails }) {
  const {
    breadcrumbItems,
    isCurriculumModalOpen,
    handleOpenCurriculumModal,
    handleCloseCurriculumModal,
  } = useCourseDetailsContent(course);

  return (
    <section>
      <View className={styles.content}>
        <div className={styles.layout}>
          <View className={styles.mainSection}>
            <header className={styles.header}>
              <Breadcrumb items={breadcrumbItems} />
              <CourseImage course={course} />
              <CourseInfo
                course={course}
                onViewCurriculum={handleOpenCurriculumModal}
              />
            </header>
            {!!course.description && (
              <CourseAbout description={course.description} />
            )}
            {!!course.methodology && (
              <CourseTextSection
                title="Metodologia"
                content={course.methodology}
              />
            )}
            {!!course.certificate && (
              <CourseTextSection
                title="Certificado"
                content={course.certificate}
              />
            )}
            {!!course.pedagogicalProject && (
              <CourseCoordination course={course} />
            )}
          </View>
        </div>

        <CurriculumGridModal
          isOpen={isCurriculumModalOpen}
          onClose={handleCloseCurriculumModal}
          course={course}
        />
      </View>
    </section>
  );
}
