import type { CourseAdmissionFormDTO } from '@/features/course-details/types';
import { ADMISSION_FORMS } from './constants';

export type AdmissionFormId = (typeof ADMISSION_FORMS)[number]['id'];

export type AdmissionForm = (typeof ADMISSION_FORMS)[number];

export type CourseAdmissionFormsProps = {
  availableForms?: readonly AdmissionForm[] | CourseAdmissionFormDTO[];
  selectedFormId?: string | null;
  onSelectForm: (formId: string) => void;
};
