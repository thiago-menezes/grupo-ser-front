import { useQuery } from '@tanstack/react-query';
import type { CurriculumResponse, CurriculumQueryParams } from '../types';

/**
 * Busca a grade curricular do curso
 */
async function fetchCurriculum(
  params: CurriculumQueryParams,
): Promise<CurriculumResponse> {
  const queryParams = new URLSearchParams({
    courseId: params.courseId,
    modality: params.modality,
    ...(params.period && { period: params.period }),
  });

  const response = await fetch(`/api/curriculum?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch curriculum: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Hook para buscar a grade curricular
 */
export function useQueryCurriculum(params: CurriculumQueryParams) {
  return useQuery({
    queryKey: ['curriculum', params.courseId, params.modality, params.period],
    queryFn: () => fetchCurriculum(params),
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!params.courseId && !!params.modality,
  });
}
