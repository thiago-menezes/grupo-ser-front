import { Divider, Text, View } from 'reshaped';
import { MarkdownContent } from '@/components';
import styles from './styles.module.scss';

export type CourseTextSectionProps = {
  title: string;
  content: string;
};

export function CourseTextSection({ title, content }: CourseTextSectionProps) {
  return (
    <View className={styles.section}>
      <Divider />
      <Text as="h2" variant="featured-2" weight="medium">
        {title}
      </Text>

      <MarkdownContent content={content} className={styles.content} />
    </View>
  );
}
