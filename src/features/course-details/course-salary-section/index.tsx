import { Divider, Text, View } from 'reshaped';
import type { CourseSalaryRangeDTO } from 'types/api/course-details';
import { Icon } from '@/components';
import type { IconNames } from '@/components/icon/types';
import styles from './styles.module.scss';

type CourseSalarySectionProps = {
  salaryRanges: CourseSalaryRangeDTO[];
};

export function CourseSalarySection({
  salaryRanges,
}: CourseSalarySectionProps) {
  return (
    <View className={styles.section}>
      <Divider />
      <View className={styles.header}>
        <Text
          as="h2"
          variant="featured-2"
          weight="medium"
          className={styles.title}
        >
          Quanto ganha um Cientista de dados
        </Text>
        <Text
          as="p"
          variant="body-2"
          color="neutral-faded"
          className={styles.intro}
        >
          O Cientista de Dados é um dos profissionais mais valorizados do
          mercado de tecnologia. Os salários variam de acordo com a experiência,
          setor e localização, mas, em geral, estão entre os mais altos da área.
        </Text>
      </View>

      <View className={styles.salaryCards}>
        {salaryRanges.map((salary) => (
          <View key={salary.level} className={styles.salaryCard}>
            <View className={styles.salaryHeader}>
              {salary.icon && (
                <Icon
                  name={salary.icon as IconNames}
                  size={24}
                  className={styles.icon}
                />
              )}
              <Text
                as="h3"
                variant="body-3"
                weight="bold"
                className={styles.level}
              >
                {salary.level}
              </Text>
            </View>
            <View className={styles.salaryInfo}>
              <Text
                variant="body-2"
                weight="bold"
                color="primary"
                className={styles.range}
              >
                {salary.range}
              </Text>
              <Text
                variant="caption-2"
                color="neutral-faded"
                className={styles.description}
              >
                {salary.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text
        as="p"
        variant="body-2"
        color="neutral-faded"
        className={styles.closing}
      >
        Com a expansão da inteligência artificial e do uso de dados nas
        organizações, a tendência é que os salários continuem crescendo e as
        oportunidades se tornem cada vez mais amplas.
      </Text>
    </View>
  );
}
