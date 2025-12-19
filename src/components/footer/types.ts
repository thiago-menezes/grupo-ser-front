import type { IconProps } from '../icon/types';

export type FooterLink = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type FooterSocialLink = FooterLink & {
  icon: IconProps['name'];
};

export type FooterBadge = {
  title: string;
  href?: string;
};

export type FooterContent = {
  socialLinks: FooterSocialLink[];
  sections: FooterSection[];
  badge: FooterBadge;
};

export type FooterProps = {
  content?: FooterContent;
};
