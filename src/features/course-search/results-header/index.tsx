import { Select, Text, View } from 'reshaped';
import { SORT_OPTIONS } from './constants';
import styles from './styles.module.scss';
import { ResultsHeaderProps } from './types';

export function ResultsHeader({ totalResults }: ResultsHeaderProps) {
  if (!totalResults) return null;

  return (
    <View className={styles.resultsHeader}>
      <Text variant="body-2" color="neutral">
        {totalResults} cursos encontrados
      </Text>
      <View className={styles.sortContainer}>
        <Text variant="body-2" color="neutral">
          Ordenar por
        </Text>
        <Select name="sort" size="small">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </View>
    </View>
  );
}
