export type CourseCoordinatorDTO = {
  id: number;
  name: string;
  description: string;
  photo?: string;
  email?: string;
  phone?: string;
};

export type CourseTeacherDTO = {
  id: number;
  name: string;
  role: string;
  title?: string;
  photo?: string;
  modalities?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

export type CoursePedagogicalProjectDTO = {
  content: string;
};

export type CourseSalaryRangeDTO = {
  level: string;
  range: string;
  description: string;
  icon?: string;
};

export type RelatedCourseDTO = {
  id: number;
  name: string;
  slug: string;
  type: string;
  duration: string;
  modality: string;
  price: number | null;
};

export type CourseUnitDTO = {
  id: number;
  name: string;
  city: string;
  state: string;
  address?: string;
  originalId?: string;
};

export type CourseEnrollmentOfferEntryDTO = {
  startMonth: number;
  endMonth: number;
  type: 'Percent' | 'Amount';
  value: string;
};

export type CourseEnrollmentPaymentOptionDTO = {
  id: number;
  value: string;
  campaignTemplate: string;
  entryOffer: CourseEnrollmentOfferEntryDTO[];
  basePrice: string;
  monthlyPrice: string;
  validFrom: string;
  validTo: string;
  coveragePriority: number;
  parsed: {
    currency: 'BRL';
    basePrice: number | null;
    monthlyPrice: number | null;
  };
};

export type CourseEnrollmentPaymentTypeDTO = {
  id: number;
  name: string;
  code: string;
  checkoutUrl: string;
  paymentOptions: CourseEnrollmentPaymentOptionDTO[];
};

export type CourseAdmissionFormDTO = {
  id: number;
  name: string;
  code: string;
  paymentTypes: CourseEnrollmentPaymentTypeDTO[];
};

export type CourseShiftDTO = {
  id: number;
  name: string;
  period: string;
  admissionForms: CourseAdmissionFormDTO[];
  courseShiftHash?: string;
};

export type CourseEnrollmentDTO = {
  courseId: string;
  courseName: string;
  modality: string;
  durationMonths: number;
  shifts: CourseShiftDTO[];
};

export type CourseDetailsDTO = {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  workload: string | null;
  category: {
    id: number;
    name: string;
  };
  duration: string;
  priceFrom: string | null;
  modalities: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  units: CourseUnitDTO[];
  offerings: Array<{
    id: number;
    unitId: number;
    modalityId: number;
    periodId: number;
    price: number | null;
    duration: string;
    enrollmentOpen: boolean;
    checkoutUrl?: string;
    unit: {
      id: number;
      name: string;
      city: string;
      state: string;
    };
    modality: {
      id: number;
      name: string;
      slug: string;
    };
    period: {
      id: number;
      name: string;
    };
  }>;
  coordinator?: CourseCoordinatorDTO;
  teachers?: CourseTeacherDTO[];
  pedagogicalProject?: CoursePedagogicalProjectDTO;
  jobMarketAreas?: string[];
  salaryRanges?: CourseSalaryRangeDTO[];
  relatedCourses?: RelatedCourseDTO[];
  featuredImage?: string;
  methodology?: string;
  certificate?: string;
  curriculumMarkdown?: string;
  enrollment?: CourseEnrollmentDTO;
};

export type CourseDetailsResponseDTO = CourseDetailsDTO;

export type CourseDetailsErrorDTO = {
  error: string;
  message?: string;
};
