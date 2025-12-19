'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Text } from 'reshaped';
import { useCurrentInstitution } from '@/hooks';
import { Icon } from '..';
import { DEFAULT_FOOTER_CONTENT } from './constants';
import { EmecBadge } from './emec-badge';
import { useEMec } from './emec-badge/api/query';
import styles from './styles.module.scss';
import type { FooterProps } from './types';

export type { FooterProps } from './types';

export function Footer({ content = DEFAULT_FOOTER_CONTENT }: FooterProps) {
  const { institutionId, institutionName } = useCurrentInstitution();
  const { socialLinks, sections, badge } = content;
  const { data: emecResponse } = useEMec(institutionId);

  const emecData = emecResponse?.data?.[0];

  return (
    <footer className={styles.wrapper} role="contentinfo">
      <div className={styles.card}>
        <div className={styles.contentGrid}>
          <div className={styles.brandBlock}>
            <Image
              src={`/logos/${institutionId}/dark.svg`}
              alt={`Logo ${institutionName}`}
              className={styles.logo}
              width={190}
              height={40}
            />

            <ul className={styles.socialList} aria-label="Redes sociais">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    aria-label={social.ariaLabel || social.label}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={social.icon} size={20} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sections}>
            {sections.map((section) => (
              <div key={section.title} className={styles.section}>
                <Text
                  as="h3"
                  variant="featured-2"
                  weight="bold"
                  className={styles.sectionTitle}
                >
                  {section.title}
                </Text>
                <ul className={styles.links}>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.badge}>
            <Text
              as="p"
              variant="body-3"
              align="center"
              className={styles.badgeTitle}
            >
              {badge.title}
            </Text>

            <EmecBadge
              href={emecData?.link ?? ''}
              title={badge.title}
              qrcodeUrl={emecData?.qrcodeUrl ?? ''}
              qrcodeAlt={emecData?.qrcodeAlt ?? 'QR Code e-MEC'}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
