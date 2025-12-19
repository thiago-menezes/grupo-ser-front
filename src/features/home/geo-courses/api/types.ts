export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CourseDTO = {
  id: string;
  name: string;
  category: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  price: number;
  campus: {
    name: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  slug: string;
};

export type GeoCoursesSectionDTO = {
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  courses: CourseDTO[];
};
