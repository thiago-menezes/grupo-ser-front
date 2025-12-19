import Image from 'next/image';
import { Modal } from 'reshaped';
import { Icon } from '@/components';
import type { ImageModalProps } from '../types';
import styles from './styles.module.scss';

export const ImageModal = ({ active, image, onClose }: ImageModalProps) => {
  if (!image) return null;

  return (
    <Modal
      active={active}
      onClose={onClose}
      size="large"
      className={styles.modal}
    >
      <div className={styles.content}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Fechar imagem"
        >
          <Icon name="x" size={24} />
        </button>
        <Image
          src={image.src}
          alt={image.alt}
          width={1000}
          height={800}
          className={styles.image}
          unoptimized
        />
      </div>
    </Modal>
  );
};
