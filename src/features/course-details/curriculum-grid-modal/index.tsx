import { Button, Modal, View, Text } from 'reshaped';
import { Icon, MarkdownContent } from '@/components';
import { CurriculumGrid } from '../curriculum-grid';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CurriculumGridModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDetails;
};

export function CurriculumGridModal({
  isOpen,
  onClose,
  course,
}: CurriculumGridModalProps) {
  // Se tiver grade curricular em markdown, exibe ela
  if (course.curriculumMarkdown) {
    return (
      <Modal active={isOpen} onClose={onClose} size="large">
        <View className={styles.modal}>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            icon={<Icon name="x" size={24} />}
            className={styles.closeButton}
            aria-label="Fechar modal"
          />

          <View className={styles.content}>
            <View className={styles.header}>
              <Text variant="featured-2" weight="bold">
                Grade curricular
              </Text>
            </View>
            <MarkdownContent content={course.curriculumMarkdown} />
          </View>
        </View>
      </Modal>
    );
  }

  // Caso contrário, usa o componente de grade curricular da API antiga
  const firstModalitySlug = course.modalities[0]?.slug;
  const validModalities = ['presencial', 'ead', 'semipresencial', 'aovivo'];
  const defaultModality = validModalities.includes(firstModalitySlug)
    ? (firstModalitySlug as 'presencial' | 'ead' | 'semipresencial' | 'aovivo')
    : 'presencial';

  return (
    <Modal active={isOpen} onClose={onClose} size="large">
      <View className={styles.modal}>
        <Button
          variant="ghost"
          size="small"
          onClick={onClose}
          icon={<Icon name="x" size={24} />}
          className={styles.closeButton}
          aria-label="Fechar modal"
        />

        <View className={styles.content}>
          <CurriculumGrid
            courseId={course.id.toString()}
            defaultModality={defaultModality}
          />
        </View>
      </View>
    </Modal>
  );
}
