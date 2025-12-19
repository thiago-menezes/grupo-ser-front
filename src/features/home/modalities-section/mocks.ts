import type { ModalityHighlight } from './types';

export const MOCK_MODALITIES: ModalityHighlight[] = [
  {
    id: 'presencial',
    title: 'Presencial',
    description:
      'Aulas no campus, contato direto com professores e vivência universitária completa.',
    icon: 'users',
    ctaLabel: 'Veja cursos presenciais',
    ctaHref: '/cursos?modalities=presencial',
  },
  {
    id: 'semipresencial',
    title: 'Semipresencial',
    description:
      'O equilíbrio perfeito entre flexibilidade e contato direto, parte online, parte presencial.',
    icon: 'user-square-rounded',
    ctaLabel: 'Veja cursos semipresenciais',
    ctaHref: '/cursos?modalities=semipresencial',
  },
  {
    id: 'ead',
    title: 'EAD',
    description:
      'Estude de onde quiser e no seu ritmo. Cursos 100% online com qualidade e máxima flexibilidade.',
    icon: 'device-laptop',
    ctaLabel: 'Veja cursos EAD',
    ctaHref: '/cursos?modalities=ead',
  },
];
