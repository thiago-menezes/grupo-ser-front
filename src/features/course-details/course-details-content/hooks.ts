'use client';

import { useCallback, useState } from 'react';
import type { CourseDetails } from '../types';

export const useCourseDetailsContent = (course: CourseDetails) => {
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Cursos', href: '/cursos' },
    { label: course.name },
  ];

  const handleOpenCurriculumModal = useCallback(() => {
    setIsCurriculumModalOpen(true);
  }, []);

  const handleCloseCurriculumModal = useCallback(() => {
    setIsCurriculumModalOpen(false);
  }, []);

  return {
    breadcrumbItems,
    isCurriculumModalOpen,
    setIsCurriculumModalOpen,
    handleOpenCurriculumModal,
    handleCloseCurriculumModal,
  };
};
