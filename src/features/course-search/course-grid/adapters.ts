import type { CourseData } from 'types/api/courses';
import type { CourseCard } from 'types/api/courses-search';

function mapModalityToUI(
  modality: string,
): 'presencial' | 'semipresencial' | 'ead' {
  const lower = modality.toLowerCase();

  if (lower.includes('presencial') && !lower.includes('semi'))
    return 'presencial';
  if (lower.includes('semi')) return 'semipresencial';
  if (lower.includes('ead') || lower.includes('distância')) return 'ead';

  return 'presencial';
}

export function adaptCourseCardToCourseData(card: CourseCard): CourseData {
  return {
    id: card.courseId,
    category: card.brand,
    title: card.courseName,
    degree: card.level,
    duration: card.durationText,
    modalities: card.modalities.map(mapModalityToUI),
    priceFrom: card.priceText,
    campusName: card.campus,
    campusCity: card.city,
    campusState: card.state,
    slug: card.courseId,
  };
}
