import { Divider, Text, View } from 'reshaped';
import styles from './styles.module.scss';

type CourseJobMarketSectionProps = {
  areas: string[];
};

export function CourseJobMarketSection({ areas }: CourseJobMarketSectionProps) {
  return (
    <View className={styles.section}>
      <Divider />
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Mercado de trabalho
      </Text>
      <View className={styles.content}>
        <Text
          as="p"
          variant="body-2"
          color="neutral-faded"
          className={styles.description}
        >
          O profissional formado em Ciência de Dados encontra um mercado em
          rápido crescimento, impulsionado pela digitalização e pela necessidade
          das empresas de tomar decisões baseadas em dados. Áreas de atuação em
          Ciência de Dados:
        </Text>
        <View as="ul" className={styles.areasList}>
          {areas.map((area) => (
            <Text
              key={area}
              as="li"
              variant="body-2"
              color="neutral-faded"
              className={styles.areaItem}
            >
              {area}
            </Text>
          ))}
        </View>
        <Text
          as="p"
          variant="body-2"
          color="neutral-faded"
          className={styles.closing}
        >
          Além dessas áreas, o cientista de dados também pode atuar em pesquisa,
          consultoria e no desenvolvimento de soluções tecnológicas voltadas
          para análise e automação.
        </Text>
      </View>
    </View>
  );
}
