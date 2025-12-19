import { Divider, Text, View } from 'reshaped';
import { MarkdownContent } from '@/components';
import styles from './styles.module.scss';

export type CourseAboutProps = {
  description: string;
};

export function CourseAbout({ description }: CourseAboutProps) {
  return (
    <View className={styles.about}>
      <Divider />
      <Text as="h2" variant="featured-2" weight="medium">
        Sobre o curso
      </Text>

      <MarkdownContent content={description} className={styles.description} />
    </View>
  );
}
