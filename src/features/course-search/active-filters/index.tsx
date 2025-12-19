import { Badge, Button, Divider, Text, View } from 'reshaped';
import { Icon } from '@/components';
import { useCourseFiltersContext } from '../context';
import styles from './styles.module.scss';

export type ActiveFiltersProps = {
  variant?: 'mobile' | 'sidebar';
};

export function ActiveFilters({ variant = 'mobile' }: ActiveFiltersProps) {
  const {
    activeFilters,
    activeFiltersCount,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useCourseFiltersContext();

  if (activeFilters.length === 0) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <View className={styles.activeFiltersSidebar}>
        <View className={styles.activeFiltersHeader}>
          <Text variant="body-2" color="neutral" weight="medium">
            Filtros aplicados
          </Text>

          <Badge color="critical" size="small" rounded>
            {activeFiltersCount}
          </Badge>
        </View>

        <View gap={2}>
          <div>
            <Button
              variant="outline"
              size="small"
              color="neutral"
              icon={<Icon name="trash" size={14} />}
              onClick={handleClearAllFilters}
            >
              Limpar todos
            </Button>
          </div>

          <View gap={2} direction="row" wrap>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                color="primary"
                variant="outline"
                onDismiss={() => handleRemoveFilter(filter.id)}
                dismissAriaLabel={`Remover filtro ${filter.label}`}
              >
                {filter.label}
              </Badge>
            ))}
          </View>
        </View>

        <Divider />
      </View>
    );
  }

  // Mobile variant
  return (
    <View className={styles.activeFiltersSection}>
      <View gap={2}>
        <div>
          <Button
            variant="outline"
            size="small"
            color="neutral"
            icon={<Icon name="trash" size={14} />}
            onClick={handleClearAllFilters}
          >
            Limpar todos
          </Button>
        </div>

        <View gap={2} direction="row" wrap>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              color="primary"
              variant="outline"
              onDismiss={() => handleRemoveFilter(filter.id)}
              dismissAriaLabel={`Remover filtro ${filter.label}`}
            >
              {filter.label}
            </Badge>
          ))}
        </View>
      </View>
    </View>
  );
}
