import Link from 'next/link';
import { Button } from 'reshaped';
import { useCurrentInstitution } from '@/hooks/useInstitution';
import { toProperCase } from '@/utils';
import { Icon } from '../icon';
import { MODALITY_LABELS } from './constants';
import styles from './styles.module.scss';
import type { CourseCardProps } from './types';

export function CourseCard({ course, className }: CourseCardProps) {
  const { institutionSlug } = useCurrentInstitution();

  // Build course URL with actual course data
  const params = new URLSearchParams();
  if (course.campusCity) params.set('city', course.campusCity);
  if (course.campusState) params.set('state', course.campusState);
  if (course.unitId) params.set('unit', course.unitId.toString());
  if (course.admissionForm) params.set('admissionForm', course.admissionForm);

  const queryString = params.toString();
  const courseUrl = `/${institutionSlug}/cursos/detalhes/${course.id}${queryString ? `?${queryString}` : ''}`;

  return (
    <Link href={courseUrl} className={`${styles.card} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.title}>{toProperCase(course.title)}</div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Icon name="school" size={12} aria-hidden="true" />
            <span>{toProperCase(course.degree)}</span>
          </div>
          <div className={styles.metaItem}>
            <Icon name="clock" size={12} aria-hidden="true" />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>

      <div className={styles.modalities}>
        <div className={styles.modalitiesLabel}>Modalidade:</div>
        <div className={styles.modalitiesList}>
          {course.modalities.map((modality) => (
            <span key={modality} className={styles.badge}>
              {MODALITY_LABELS[modality]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.priceLabel}>A partir de:</div>
        <div className={styles.price}>{course.priceFrom}</div>
      </div>

      <div className={styles.locationWrapper}>
        <div className={styles.location}>
          <span className={styles.campusName}>
            {toProperCase(course.campusName)}
          </span>
          <span className={styles.campusCity}>
            {toProperCase(course.campusCity)} - {course.campusState}
          </span>
        </div>
      </div>

      <Button
        color="primary"
        fullWidth
        aria-label={`Saiba mais sobre ${toProperCase(course.title)}`}
      >
        Mais sobre o curso
      </Button>
    </Link>
  );
}
