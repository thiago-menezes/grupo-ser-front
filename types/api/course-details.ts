export type CourseDetailsDTO = {
  id: number;
  courseId: string;
  name: string;
  description?: unknown; // Rich text (Blocks)
  methodology?: unknown; // Rich text (Blocks)
  curriculumGrid?: unknown; // Rich text (Blocks)
  certificate?: unknown; // Rich text (Blocks)
  featuredImage?: string;
  institution?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
  pedagogicalProject?: unknown; // Rich text (Blocks)
  featured: boolean;

  // Optional fields used by various UI components
  modalities?: { id: number; name: string; slug: string }[];
  shifts?: CourseShiftDTO[];
  faqs?: CourseFAQDTO[];
  salaryRanges?: CourseSalaryRangeDTO[];
  teachers?: CourseTeacherDTO[];
  coordinators?: CourseTeacherDTO[];
  relatedCourses?: CourseDetailsDTO[];
};

export type CourseDetailsResponseDTO = CourseDetailsDTO;

export type CourseDetailsErrorDTO = {
  error: string;
  message?: string;
};

export type CourseSalaryRangeDTO = {
  level: string;
  range: string;
  description: string;
  icon?: string;
};

export type CourseFAQDTO = {
  question: string;
  answer: string;
};

export type CourseUnitDTO = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
};

export type EntryOfferDTO = {
  startMonth: number;
  endMonth: number;
  type: 'Percent' | 'Amount';
  value: string;
};

export type PaymentOptionDTO = {
  id: number;
  value: string;
  campaignTemplate: string;
  entryOffer: EntryOfferDTO[];
  basePrice: string;
  monthlyPrice: string;
  validFrom: string;
  validTo: string;
  coveragePriority: number;
  parsed: {
    currency: string;
    basePrice: number | null;
    monthlyPrice: number | null;
  };
};

export type PaymentTypeDTO = {
  id: number;
  name: string;
  code: string;
  checkoutUrl: string;
  paymentOptions: PaymentOptionDTO[];
};

export type CourseAdmissionFormDTO = {
  id: number;
  name: string;
  code: string;
  paymentTypes: PaymentTypeDTO[];
};

export type CourseShiftDTO = {
  id: number;
  name: string;
  period: string;
  courseShiftHash?: string;
  admissionForms: CourseAdmissionFormDTO[];
};

export type CourseEnrollmentDTO = {
  courseId: string;
  courseName: string;
  modality: string;
  durationMonths: number;
  shifts: CourseShiftDTO[];
};

export type CourseTeacherDTO = {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  modalities?: { id: number; name: string }[];
};
