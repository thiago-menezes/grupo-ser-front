import type { InstitutionDTO } from 'types/api/institutions';
import { strapiFetch } from '../../services/strapi';
import type { StrapiInstitution } from '../../transformers/strapi';
import { transformInstitution } from '../../transformers/strapi';

export type InstitutionQueryParams = {
  slug: string;
  noCache?: boolean;
};

export async function handleInstitutionBySlug(
  params: InstitutionQueryParams,
): Promise<InstitutionDTO | null> {
  const data = await strapiFetch<{ data: StrapiInstitution[] }>(
    'institutions',
    {
      filters: {
        slug: { $eq: params.slug },
      },
      populate: '*',
    },
    params.noCache,
  );

  if (!data?.data || data.data.length === 0) {
    return null;
  }

  return transformInstitution(data.data[0]);
}
