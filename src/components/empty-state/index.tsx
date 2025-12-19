import { Button, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import type { EmptyStateProps } from './types';

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className={styles.container} align="center" gap={4}>
      <View align="center" gap={2}>
        <Icon name={icon} size={72} className={styles.icon} />

        <Text
          as="h2"
          variant="featured-3"
          weight="bold"
          color="primary"
          align="center"
        >
          {title}
        </Text>

        <Text
          variant="body-2"
          color="neutral-faded"
          align="center"
          className={styles.description}
        >
          {description}
        </Text>
      </View>

      {actionLabel && (
        <Button variant="outline" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

export type { EmptyStateProps } from './types';
