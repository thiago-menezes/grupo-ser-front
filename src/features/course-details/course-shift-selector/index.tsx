import { Text, View } from 'reshaped';
import type { CourseShiftDTO } from '@/types/api/course-details';
import styles from './styles.module.scss';

export type CourseShiftSelectorProps = {
  shifts: CourseShiftDTO[];
  selectedShiftId: number | null;
  onSelectShift: (shiftId: number) => void;
};

export function CourseShiftSelector({
  shifts,
  selectedShiftId,
  onSelectShift,
}: CourseShiftSelectorProps) {
  if (!shifts || shifts.length === 0) return null;

  return (
    <View className={styles.shiftSelector}>
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.label}
      >
        Selecione o turno:
      </Text>

      <View className={styles.shiftGrid}>
        {shifts.map((shift) => {
          const isSelected =
            selectedShiftId !== null && selectedShiftId === shift.id;
          const isDisabled = shifts.length === 1;
          return (
            <button
              key={shift.id}
              type="button"
              className={`${styles.shiftButton} ${
                isSelected ? styles.selected : ''
              } ${isDisabled ? styles.disabled : ''}`}
              aria-label={shift.name}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onSelectShift(shift.id)}
            >
              <Text
                as="span"
                variant="body-2"
                weight="bold"
                className={styles.shiftLabel}
              >
                {shift.name}
              </Text>
            </button>
          );
        })}
      </View>
    </View>
  );
}
