import Link from 'next/link';
import { Text, View } from 'reshaped';
import { useCurrentInstitution } from '@/hooks';
import styles from './styles.module.scss';

export function CourseSearchHeader() {
  const { institutionId } = useCurrentInstitution();

  return (
    <View className={styles.header}>
      <Text variant="body-2" color="neutral-faded">
        <Link className={styles.homeLink} href={`/${institutionId}`}>
          Home
        </Link>{' '}
        /{' '}
        <Text as="strong" color="primary" weight="bold">
          Lista de cursos
        </Text>
      </Text>
      <Text
        as="h1"
        variant={{ m: 'title-6', s: 'featured-3' }}
        weight="bold"
        color="neutral"
      >
        Encontre o curso ideal para você
      </Text>
    </View>
  );
}
