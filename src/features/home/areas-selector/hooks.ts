import { useRouter } from 'next/navigation';
import { useCurrentInstitution } from '@/hooks';
import { AreaOfInterestItemDTO } from './api/types';

export function useAreaSelector() {
  const { institutionId } = useCurrentInstitution();
  const router = useRouter();

  const handleCourseClick = (
    area: AreaOfInterestItemDTO,
    courseName: string,
  ) => {
    if (!institutionId) return;
    const params = new URLSearchParams({
      area: area.title,
      course: courseName,
    });
    router.push(`/${institutionId}/cursos?${params.toString()}`);
  };

  const handleAllCourses = (areaName: string) => {
    if (!institutionId) return;
    const params = new URLSearchParams({
      area: areaName,
    });
    router.push(`/${institutionId}/cursos?${params.toString()}`);
  };

  return {
    handleCourseClick,
    handleAllCourses,
  };
}
