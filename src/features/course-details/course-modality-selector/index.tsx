import { Text, View } from 'reshaped';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseModalitySelectorProps = {
  modalities: CourseDetails['modalities'];
  selectedModalityId: number | null;
  onSelectModality: (modalityId: number) => void;
};

const MODALITY_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  ead: 'Digital (EAD)',
  'ao-vivo': 'Ao vivo',
  hibrido: 'Híbrido',
  semipresencial: 'Semipresencial',
};

export function CourseModalitySelector({
  modalities,
  selectedModalityId,
  onSelectModality,
}: CourseModalitySelectorProps) {
  if (modalities.length === 0) return null;

  return (
    <View className={styles.modalitySelector}>
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.label}
      >
        Selecione a modalidade:
      </Text>

      <View className={styles.modalityGrid}>
        {modalities.map((modality) => {
          const isSelected = selectedModalityId === modality.id;
          const isDisabled = modalities.length === 1;
          return (
            <button
              key={modality.id}
              type="button"
              className={`${styles.modalityButton} ${
                isSelected ? styles.selected : ''
              } ${isDisabled ? styles.disabled : ''}`}
              aria-label={MODALITY_LABELS[modality.slug] || modality.name}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onSelectModality(modality.id)}
            >
              <Text
                as="span"
                variant="body-2"
                weight="bold"
                className={styles.modalityLabel}
              >
                {MODALITY_LABELS[modality.slug] || modality.name}
              </Text>
            </button>
          );
        })}
      </View>
    </View>
  );
}
