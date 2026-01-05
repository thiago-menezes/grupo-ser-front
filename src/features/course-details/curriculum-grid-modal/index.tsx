import { Button, Modal, View, Text } from 'reshaped';
import { Icon, RichTextRenderer } from '@/components';
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
  if (!course.curriculumGrid) {
    return null;
  }

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
          <RichTextRenderer content={course.curriculumGrid} />
        </View>
      </View>
    </Modal>
  );
}
