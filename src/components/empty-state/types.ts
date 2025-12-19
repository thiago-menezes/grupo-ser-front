import type { IconNames } from '@/components/icon';

export type EmptyStateProps = {
  icon: IconNames;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};
