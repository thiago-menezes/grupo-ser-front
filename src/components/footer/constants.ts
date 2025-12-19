import type { FooterContent } from './types';

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  socialLinks: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/@nome-da-instituicao',
      icon: 'brand-instagram',
      ariaLabel: 'Instagram',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/nome-da-instituicao',
      icon: 'brand-facebook',
      ariaLabel: 'Facebook',
    },
    {
      label: 'Twitter',
      href: 'https://www.twitter.com/nome-da-instituicao',
      icon: 'brand-twitter',
      ariaLabel: 'Twitter',
    },
    {
      label: 'Chats',
      href: 'https://wa.me/5511999999999',
      icon: 'message-circle',
      ariaLabel: 'WhatsApp/Chat',
    },
  ],
  sections: [
    {
      title: 'Sobre a instituição',
      links: [
        { label: 'Sobre a instituição', href: '#' },
        { label: 'Políticas de ensino', href: '#' },
        { label: 'Contatos', href: '#' },
        { label: 'Aviso de privacidade', href: '#' },
        { label: 'Regulamento', href: '#' },
      ],
    },
    {
      title: 'Formas de ingresso',
      links: [
        { label: 'Vestibular', href: '#' },
        { label: 'ENEM', href: '#' },
        { label: 'Transferência', href: '#' },
        { label: 'Outro diploma', href: '#' },
      ],
    },
    {
      title: 'Áreas de estudo',
      links: [
        { label: 'Áreas Criativas', href: '#' },
        { label: 'Carreiras em Educação', href: '#' },
        { label: 'Carreiras em Finanças', href: '#' },
        { label: 'Carreiras em Saúde', href: '#' },
        { label: 'Carreiras em Tecnologia', href: '#' },
        { label: 'Carreiras Emergentes', href: '#' },
        { label: 'Comunicação', href: '#' },
      ],
    },
  ],
  badge: {
    title: 'Consulte aqui o cadastro da Instituição no e-MEC',
    href: '#',
  },
};
