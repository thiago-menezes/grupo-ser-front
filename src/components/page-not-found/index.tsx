import Link from 'next/link';
import { Button, Text, View } from 'reshaped';
import { useCurrentInstitution } from '@/hooks';
import { Icon } from '..';
import styles from './styles.module.scss';

export function PageNotFound() {
  const { institutionSlug } = useCurrentInstitution();
  return (
    <View className={styles.container}>
      <View className={styles.content} align="center" gap={6}>
        <View className={styles.iconContainer}>
          <Icon name="error-404" size={120} />
        </View>

        <View align="center" gap={3}>
          <Text
            as="h1"
            variant="featured-1"
            weight="bold"
            color="neutral"
            align="center"
          >
            Página não encontrada
          </Text>

          <Text
            variant="body-1"
            color="neutral-faded"
            align="center"
            className={styles.description}
          >
            A página que você está procurando <br />
            não existe ou foi movida.
          </Text>
        </View>

        <View gap={3} direction="row" align="center">
          <Link href={`/${institutionSlug}`}>
            <Button
              variant="solid"
              color="neutral"
              icon={<Icon name="home" size={20} />}
            >
              Página inicial
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
