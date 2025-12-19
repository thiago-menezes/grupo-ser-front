/**
 * Infrastructure API types
 * These represent the TRANSFORMED data from the BFF (English field names)
 * The BFF transforms Portuguese Strapi fields to these English DTOs
 */

export type StrapiUnitPhoto = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiUnitInstitution = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  website: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiUnit = {
  id: number;
  documentId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  photos: StrapiUnitPhoto[];
  institution: StrapiUnitInstitution;
};

export type StrapiUnitsResponse = {
  data: StrapiUnit[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

/**
 * Client Units Response (from BFF)
 */
export interface ClientUnit {
  id: number;
  name: string;
  state: string;
  city: string;
}

export interface ClientUnitsResponse {
  data: ClientUnit[];
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
  };
}
