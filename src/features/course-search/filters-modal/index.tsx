import { Modal, View } from 'reshaped';
import { FiltersContent } from '../filters-content';
import styles from './styles.module.scss';

export type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  return (
    <Modal
      active={isOpen}
      onClose={onClose}
      size="large"
      className={styles.filtersModal}
    >
      <View className={styles.filtersModalContent}>
        <FiltersContent handleCloseModal={onClose} />
      </View>
    </Modal>
  );
}
