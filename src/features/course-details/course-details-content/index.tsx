import { useMemo, useState } from 'react';
import { View } from 'reshaped';
import { Breadcrumb } from '@/components';
import { useCityContext } from '@/contexts/city';
import { InfrastructureSection } from '@/features';
import { useQueryParams } from '@/hooks';
import { CourseAbout } from '../course-about';
import { CourseAdmissionForms } from '../course-admission-forms';
import { CourseCoordination } from '../course-coordination';
import { CourseEnrollmentSidebar } from '../course-enrollment-sidebar';
import { CourseImage } from '../course-image';
import { CourseInfo } from '../course-info';
import { CourseJobMarketSection } from '../course-job-market-section';
import { CourseModalitySelector } from '../course-modality-selector';
import { CourseShiftSelector } from '../course-shift-selector';
import { CourseTextSection } from '../course-text-section';
import { CurriculumGridModal } from '../curriculum-grid-modal';
import type { CourseDetails } from '../types';
import { useCourseDetailsContent } from './hooks';
import styles from './styles.module.scss';

export function CourseDetailsContent({ course }: { course: CourseDetails }) {
  const { searchParams, setParam } = useQueryParams();
  const { setCityState } = useCityContext();
  const unitFromUrl = searchParams.get('unit');

  const {
    breadcrumbItems,
    setIsCurriculumModalOpen,
    selectedModalityId,
    selectedAdmissionFormId,
    handleModalityChange,
    handleAdmissionFormChange,
    isCurriculumModalOpen,
    selectedTurnoId,
    handleTurnoChange,
  } = useCourseDetailsContent(course);

  const [selectedUnitId, setSelectedUnitId] = useState<number>(() => {
    if (unitFromUrl) {
      return parseInt(unitFromUrl, 10);
    }
    return course.offerings[0]?.unitId || course.units[0]?.id;
  });

  // Get admission forms from selected shift (enrollment data)
  const availableAdmissionForms = useMemo(() => {
    if (!course.enrollment?.shifts?.length) return undefined;

    const selectedShift = course.enrollment.shifts.find(
      (t) => t.id === selectedTurnoId,
    );

    return (
      selectedShift?.admissionForms ||
      course.enrollment.shifts[0]?.admissionForms
    );
  }, [course.enrollment, selectedTurnoId]);

  const handleUnitClick = (unitId: number) => {
    const unit = course.units.find((u) => u.id === unitId);
    if (unit) {
      setCityState(unit.city, unit.state, 'manual');
      setParam('unit', unitId.toString());
    }

    setSelectedUnitId(unitId);

    // Scroll para infraestrutura
    const infraSection = document.getElementById('infrastructure-section');
    if (infraSection) {
      infraSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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
                selectedUnitId={selectedUnitId}
                onUnitClick={handleUnitClick}
                onViewCurriculum={() => setIsCurriculumModalOpen(true)}
              />
              <CourseModalitySelector
                modalities={course.modalities}
                selectedModalityId={selectedModalityId}
                onSelectModality={handleModalityChange}
              />
              {course.enrollment?.shifts &&
                course.enrollment.shifts.length > 0 && (
                  <CourseShiftSelector
                    shifts={course.enrollment.shifts}
                    selectedShiftId={selectedTurnoId}
                    onSelectShift={handleTurnoChange}
                  />
                )}
              <CourseAdmissionForms
                availableForms={availableAdmissionForms}
                selectedFormId={selectedAdmissionFormId}
                onSelectForm={handleAdmissionFormChange}
              />
            </header>
            {course.description && (
              <CourseAbout description={course.description} />
            )}
            {course.methodology && (
              <CourseTextSection
                title="Metodologia"
                content={course.methodology}
              />
            )}
            {course.jobMarketAreas && course.jobMarketAreas.length > 0 && (
              <CourseJobMarketSection areas={course.jobMarketAreas} />
            )}
            {course.certificate && (
              <CourseTextSection
                title="Certificado"
                content={course.certificate}
              />
            )}
            {(course.coordinator ||
              (course.teachers && course.teachers.length > 0) ||
              course.pedagogicalProject) && (
              <CourseCoordination
                course={course}
                selectedModalityId={selectedModalityId}
              />
            )}
          </View>

          <CourseEnrollmentSidebar
            course={course}
            selectedModalityId={selectedModalityId}
            selectedUnitId={selectedUnitId}
            selectedPeriodId={selectedTurnoId}
            selectedAdmissionFormCode={selectedAdmissionFormId}
          />
        </div>

        <InfrastructureSection preselectedUnitId={selectedUnitId} />

        <CurriculumGridModal
          isOpen={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
          course={course}
        />
      </View>
    </section>
  );
}
