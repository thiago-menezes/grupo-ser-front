import { formatPrice } from '@/packages/utils';
import { CourseDTO } from './types';

export function transformCourseDTO(dto: CourseDTO) {
  return {
    id: dto.id,
    category: dto.category,
    title: dto.name,
    degree: dto.degree,
    duration: dto.duration,
    modalities: dto.modalities,
    priceFrom: formatPrice(dto.price),
    campusName: dto.campus.name,
    campusCity: dto.campus.city,
    campusState: dto.campus.state,
    slug: dto.slug,
  };
}
