import Link from 'next/link';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components';
import styles from './styles.module.scss';
import { InstitutionCardProps } from './types';

export const InstitutionCard = ({
  name,
  description,
  slug,
}: InstitutionCardProps) => {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <Text as="h3" variant="featured-3" weight="bold" color="neutral">
          {name}
        </Text>
        <Text as="p" variant="body-3" color="neutral-faded">
          {description}
        </Text>
      </header>

      <Link href={`/${slug}`}>
        <Button
          variant="solid"
          color="primary"
          endIcon={<Icon name="arrow-right" />}
        >
          Conheça
        </Button>
      </Link>
    </article>
  );
};
