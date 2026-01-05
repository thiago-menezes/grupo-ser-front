export type QuickSearchFormProps = {
  onSubmit?: (data: QuickSearchFormData) => void;
};

export type QuickSearchFormData = {
  city: string;
  course: string;
  modalities: Array<'presencial' | 'semi' | 'ead'>;
  courseLevel: CourseLevel;
};

export type CourseLevel = 'graduation' | 'postgraduate';
