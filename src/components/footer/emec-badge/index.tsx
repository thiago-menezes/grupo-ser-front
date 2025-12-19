import Image from 'next/image';
import Link from 'next/link';
import { Text } from 'reshaped';
import { getMediaUrl } from '@/packages/utils';
import styles from './styles.module.scss';
import type { EmecBadgeProps } from './types';

export type { EmecBadgeProps } from './types';

const QR_CODE_PLACEHOLDER = 'https://placehold.co/320x320.png';

export function EmecBadge({
  href = '#',
  title,
  qrcodeUrl,
  qrcodeAlt = 'QR Code e-MEC',
}: EmecBadgeProps) {
  return (
    <Link href={href} className={styles.container} aria-label={title}>
      <div className={styles.header}>
        <Image
          src="/logos/emec.png"
          alt="Logo e-MEC"
          width={72}
          height={28}
          className={styles.logo}
        />
      </div>
      <div className={styles.qrCodeWrapper}>
        <Image
          src={getMediaUrl(qrcodeUrl) || QR_CODE_PLACEHOLDER}
          alt={qrcodeAlt}
          width={320}
          height={320}
          className={styles.qrCode}
        />
      </div>
      <Text as="p" variant="body-2" color="primary" weight="bold">
        Acesse já!
      </Text>
    </Link>
  );
}
