import type { CourseTeacherDTO } from 'types/api/course-details';

/**
 * Filter teachers by selected modality
 * Returns teachers that either:
 * 1. Have no modality restrictions (can teach all modalities)
 * 2. Have the selected modality in their modalities list
 */
export function filterTeachersByModality(
  teachers: CourseTeacherDTO[] | undefined,
  selectedModalityId: number | null,
): CourseTeacherDTO[] {
  if (!teachers || teachers.length === 0) {
    return [];
  }

  // If no modality is selected, return all teachers
  if (!selectedModalityId) {
    return teachers;
  }

  return teachers.filter((teacher) => {
    // If teacher has no modalities specified, they can teach all modalities
    if (!teacher.modalities || teacher.modalities.length === 0) {
      return true;
    }

    // Check if teacher can teach the selected modality
    return teacher.modalities.some((m) => m.id === selectedModalityId);
  });
}

/**
 * Check if a teacher can teach a specific modality
 */
export function canTeacherTeachModality(
  teacher: CourseTeacherDTO,
  modalityId: number,
): boolean {
  // If teacher has no modalities specified, they can teach all modalities
  if (!teacher.modalities || teacher.modalities.length === 0) {
    return true;
  }

  return teacher.modalities.some((m) => m.id === modalityId);
}
