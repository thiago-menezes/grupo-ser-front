import { clsx } from 'clsx';
import { Text } from 'reshaped';
import { Icon } from '@/components';
import { DEFAULT_ENTRY_METHODS } from './constants';
import styles from './styles.module.scss';

export function EntryMethodsSection() {
  const sectionClassName = clsx(styles.section);

  return (
    <section
      className={sectionClassName}
      aria-labelledby="entry-methods-section-title"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Text
            as="h2"
            variant="featured-1"
            weight="bold"
            className={styles.title}
          >
            Conheça nossas formas de ingresso
          </Text>
          <Text as="p" variant="body-2" className={styles.subtitle}>
            Diferentes opções para começar agora sua jornada acadêmica.
            vestibular, nota do ENEM, transferência ou segunda graduação.
          </Text>
        </div>

        <div className={styles.cards} role="list">
          {DEFAULT_ENTRY_METHODS.map((form) => (
            <article key={form.id} className={styles.card} role="listitem">
              <div className={styles.cardHeader}>
                <Icon name={form.icon} size={24} className={styles.icon} />
                <Text
                  as="h3"
                  variant="featured-2"
                  weight="bold"
                  className={styles.cardTitle}
                >
                  {form.title}
                </Text>
              </div>

              <Text as="p" variant="body-2" className={styles.cardDescription}>
                {form.description}
              </Text>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
