import type { CareerPathContent } from './types';

export const DEFAULT_CAREER_PATH_CONTENT: CareerPathContent = {
  cards: [
    {
      id: 'graduation',
      title: 'Graduação',
      description:
        'Primeiro passo da sua carreira. Formando profissionais prontos para o mercado, com base teórica e prática na área escolhida.',
      icon: 'school',
      colorTheme: 'primary',
      modalities: [
        { id: 'presencial', label: 'Presencial' },
        { id: 'semipresencial', label: 'Semipresencial' },
        { id: 'ead', label: 'EAD' },
      ],
      ctaLabel: 'Veja cursos Graduação',
      ctaHref: '/cursos?courseLevel=graduation',
    },
    {
      id: 'postgraduate',
      title: 'Pós-graduação',
      description:
        'Aprofunde seus conhecimentos. Voltada a quem já tem diploma superior e quer se especializar ou crescer na carreira.',
      icon: 'briefcase',
      colorTheme: 'secondary',
      modalities: [
        { id: 'ao-vivo', label: 'Ao vivo' },
        { id: 'digital', label: 'Digital' },
      ],
      ctaLabel: 'Veja cursos Pós-graduação',
      ctaHref: '/cursos?courseLevel=postgraduate',
    },
  ],
};
