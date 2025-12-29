import { Accordion, Text, View } from 'reshaped';
import type { CourseFaq as CourseFaqType } from '../types';
import styles from './styles.module.scss';

export type CourseFaqProps = {
  faqs: CourseFaqType[];
};

export function CourseFaq({ faqs }: CourseFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <View className={styles.faq}>
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Perguntas Frequentes
      </Text>
      <View className={styles.accordionContainer}>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <Accordion.Trigger>
              <Text as="h3" variant="body-2" weight="bold">
                {faq.question}
              </Text>
            </Accordion.Trigger>
            <Accordion.Content>
              <Text variant="body-2" color="neutral-faded">
                {faq.answer}
              </Text>
            </Accordion.Content>
          </Accordion>
        ))}
      </View>
    </View>
  );
}
