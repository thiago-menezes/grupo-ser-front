import { Accordion, Divider, Text, View } from 'reshaped';
import { useCurrentInstitution } from '@/hooks';
import { usePerguntasFrequentes } from './api';
import styles from './styles.module.scss';

const DEFAULT_FAQ_ITEMS = [
  {
    id: 1,
    question: 'Como funciona o processo seletivo?',
    answer:
      'O processo seletivo pode ser realizado através de Vestibular online, utilização de notas do ENEM dos últimos 5 anos, Transferência de outra instituição ou utilização de outro diploma de nível superior.',
  },
  {
    id: 2,
    question: 'A instituição possui PROUNI, FIES ou algum financiamento?',
    answer:
      'Sim, aceitamos PROUNI e FIES. Além disso, oferecemos financiamento estudantil através de parceiros, que permite parcelar até 100% do valor do curso. Entre em contato conosco para mais informações sobre as condições.',
  },
  {
    id: 3,
    question: 'Quais modalidades de ensino são oferecidas?',
    answer:
      'Oferecemos cursos em modalidade presencial, semipresencial, digital (EAD) e ao vivo, proporcionando flexibilidade para que você escolha a melhor opção para sua rotina.',
  },
  {
    id: 4,
    question: 'A instituição é reconhecida pelo MEC?',
    answer:
      'Sim, a instituição é reconhecida pelo MEC. Você pode consultar o cadastro da instituição no e-MEC através do QR code disponível no rodapé do site.',
  },
  {
    id: 5,
    question: 'Como posso entrar em contato?',
    answer:
      'Você pode entrar em contato através do nosso site, telefone, WhatsApp ou visitando uma de nossas unidades. Nossa equipe está pronta para esclarecer todas as suas dúvidas.',
  },
  {
    id: 6,
    question: 'Existe algum programa de bolsas de estudo?',
    answer:
      'Sim, oferecemos diversos programas de bolsas de estudo e descontos. Entre em contato conosco para conhecer todas as opções disponíveis e verificar sua elegibilidade.',
  },
];

export function FAQSection() {
  const { institutionId } = useCurrentInstitution();
  const { data: faqsResponse } = usePerguntasFrequentes(institutionId);

  const apiItems = (faqsResponse?.data ?? [])
    .map((item) => ({
      id: item.id,
      question: item.question ?? '',
      answer: item.answer ?? '',
    }))
    .filter((item) => item.question && item.answer);

  const displayItems = apiItems.length > 0 ? apiItems : DEFAULT_FAQ_ITEMS;

  return (
    <section className={styles.section} aria-labelledby="faq-section-title">
      <div className={styles.container}>
        <View className={styles.content}>
          <Divider />
          <View className={styles.header}>
            <Text
              as="h2"
              variant="featured-2"
              weight="medium"
              className={styles.title}
            >
              Perguntas frequentes
            </Text>
            <Text as="p" variant="body-3" className={styles.subtitle}>
              Tire suas dúvidas sobre nossa instituição e processos de
              matrícula.
            </Text>
          </View>

          <View className={styles.faqList}>
            {displayItems.map((item) => (
              <Accordion key={item.id} className={styles.faqItem}>
                <Accordion.Trigger>
                  <Text as="h3" className={styles.faqQuestion}>
                    <strong>{item.question}</strong>
                  </Text>
                </Accordion.Trigger>

                <Accordion.Content>
                  <Text variant="body-3" className={styles.faqAnswer}>
                    {item.answer}
                  </Text>
                </Accordion.Content>
              </Accordion>
            ))}
          </View>
        </View>
      </div>
    </section>
  );
}
