export type QuickSearchFormProps = {
  institutionSlug: string;
  onSubmit?: (data: QuickSearchFormData) => void;
};

export type QuickSearchFormData = {
  city: string;
  course: string;
  modalities: Array<'presencial' | 'semi' | 'ead'>;
  courseLevel: CourseLevel;
};

export type CourseLevel = 'graduation' | 'postgraduate';
