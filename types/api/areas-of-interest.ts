export type AreaOfInterestCourseDTO = {
  id: string;
  name: string;
  slug: string;
};

export type AreaOfInterestItemDTO = {
  id: number;
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string | null;
  courses: AreaOfInterestCourseDTO[];
};

export type AreasOfInterestResponseDTO = {
  data: AreaOfInterestItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type AreasOfInterestErrorDTO = {
  error: string;
  message?: string;
};
