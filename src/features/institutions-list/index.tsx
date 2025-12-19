import Image from 'next/image';
import { Container, Grid, Text, View } from 'reshaped';
import { INSTITUTIONS } from './constants';
import { InstitutionCard } from './institution-card';
import styles from './styles.module.scss';

export const InstitutionsList = () => {
  return (
    <Container className={styles.container}>
      <View direction="column" gap={8} className={styles.contentSide}>
        <View direction="column" gap={4}>
          <View.Item>
            <div className={styles.logoWrapper}>
              <Image
                src="/logos/grupo-ser.png"
                alt="Ser Educacional"
                width={160}
                height={72}
                priority
              />
            </div>
          </View.Item>

          <View.Item>
            <Text
              as="h1"
              variant="featured-1"
              color="neutral"
              className={styles.title}
            >
              Conheça Nossas <br /> Instituições de Ensino
            </Text>
          </View.Item>

          <View.Item>
            <Text
              as="p"
              variant="body-1"
              color="neutral-faded"
              className={styles.subtitle}
            >
              Descubra a instituição ideal para o seu futuro.
            </Text>
          </View.Item>
        </View>

        <Grid columns={{ s: 1, m: 2 }} gap={4}>
          {INSTITUTIONS.map((institution) => (
            <InstitutionCard key={institution.slug} {...institution} />
          ))}
        </Grid>
      </View>
    </Container>
  );
};
