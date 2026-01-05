import { Divider, Text, View } from 'reshaped';
import { RichTextRenderer } from '@/components';
import styles from './styles.module.scss';

export type CourseTextSectionProps = {
  title: string;
  content: unknown;
};

export function CourseTextSection({ title, content }: CourseTextSectionProps) {
  return (
    <View className={styles.section}>
      <Divider />
      <Text as="h2" variant="featured-2" weight="medium">
        {title}
      </Text>

      <RichTextRenderer content={content} className={styles.content} />
    </View>
  );
}
