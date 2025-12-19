import { clsx } from 'clsx';
import Link from 'next/link';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components';
import { useCurrentInstitution } from '@/hooks';
import { DEFAULT_CAREER_PATH_CONTENT } from './constants';
import styles from './styles.module.scss';
import type { CareerPathProps } from './types';

export function CareerPath({
  content = DEFAULT_CAREER_PATH_CONTENT,
}: CareerPathProps) {
  const { institutionId } = useCurrentInstitution();

  return (
    <section className={styles.section} aria-labelledby="career-path-title">
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Text
              as="h2"
              variant="featured-1"
              weight="bold"
              className={styles.title}
            >
              Escolha o caminho que combina com você
            </Text>
            <Text as="p" variant="body-2" className={styles.subtitle}>
              Aqui você encontra a trilha ideal para chegar no seu objetivo!
            </Text>
          </header>

          <div className={styles.cards} role="list">
            {content.cards.map((card) => (
              <article key={card.id} className={styles.card} role="listitem">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <Icon
                      name={card.icon}
                      size={24}
                      className={`${styles.icon} ${
                        card.colorTheme === 'primary'
                          ? styles.iconPrimary
                          : styles.iconSecondary
                      }`}
                      aria-hidden="true"
                    />
                    <Text
                      as="h3"
                      variant="featured-2"
                      weight="bold"
                      className={`${styles.cardTitle} ${
                        card.colorTheme === 'primary'
                          ? styles.cardTitlePrimary
                          : styles.cardTitleSecondary
                      }`}
                    >
                      {card.title}
                    </Text>
                  </div>
                  <Text
                    as="p"
                    variant="body-2"
                    className={styles.cardDescription}
                  >
                    {card.description}
                  </Text>
                </div>

                <div className={styles.modalities}>
                  <Text
                    as="span"
                    variant="caption-1"
                    weight="medium"
                    className={styles.modalitiesLabel}
                  >
                    Modalidades:
                  </Text>
                  <div className={styles.modalitiesList}>
                    {card.modalities.map((modality) => (
                      <span
                        key={modality.id}
                        className={`${styles.badge} ${
                          card.colorTheme === 'primary'
                            ? styles.badgePrimary
                            : styles.badgeSecondary
                        }`}
                      >
                        {modality.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`${styles.buttonWrapper} ${
                    card.colorTheme === 'primary'
                      ? styles.buttonPrimary
                      : styles.buttonSecondary
                  }`}
                >
                  <Link
                    href={`/${institutionId}${card.ctaHref}`}
                    className={styles.link}
                  >
                    <Button
                      variant="outline"
                      className={clsx('button', {
                        [styles.buttonPrimary]: card.colorTheme === 'primary',
                        [styles.buttonSecondary]:
                          card.colorTheme === 'secondary',
                      })}
                      fullWidth
                      endIcon={
                        <Icon
                          name="chevron-right"
                          size={16}
                          aria-hidden="true"
                        />
                      }
                    >
                      {card.ctaLabel}
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
