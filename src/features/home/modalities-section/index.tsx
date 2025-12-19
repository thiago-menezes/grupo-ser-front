import { clsx } from 'clsx';
import Link from 'next/link';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components';
import { useCurrentInstitution } from '@/hooks/useInstitution';
import { MOCK_MODALITIES } from './mocks';
import styles from './styles.module.scss';

export function ModalitiesSection() {
  const modalities = MOCK_MODALITIES;
  const sectionClassName = clsx(styles.section);
  const { institutionId } = useCurrentInstitution();

  return (
    <section
      className={sectionClassName}
      aria-labelledby="modalities-section-title"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Text as="h2" variant="featured-1" weight="bold">
            Nossas modalidades de Graduação
          </Text>
          <Text as="p" variant="body-2">
            Escolha o curso que mais se adequa à sua carreira profissional e
            comece a estudar agora!
          </Text>
        </div>

        <div className={styles.cards} role="list">
          {modalities.map((modality) => (
            <article key={modality.id} className={styles.card} role="listitem">
              <div className={styles.cardHeader}>
                <Icon name={modality.icon} size={24} className={styles.icon} />
                <Text as="h3" variant="featured-2" weight="bold">
                  {modality.title}
                </Text>
              </div>

              <Text as="p" variant="body-2" className={styles.cardDescription}>
                {modality.description}
              </Text>

              <Link href={`/${institutionId}/${modality.ctaHref}`}>
                <Button
                  variant="ghost"
                  color="primary"
                  endIcon={
                    <Icon
                      name="chevron-right"
                      size={16}
                      className={styles.ctaIcon}
                    />
                  }
                >
                  {modality.ctaLabel}
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
