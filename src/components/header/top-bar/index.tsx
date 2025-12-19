import { clsx } from 'clsx';
import Link from 'next/link';
import { Button } from 'reshaped';
import { useColorMode } from '@/hooks';
import { Icon } from '../..';
import styles from '../styles.module.scss';

export const TopBar = () => {
  const { invertColorMode, colorMode } = useColorMode();

  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <div className={styles.topBarContent}>
          <nav className={styles.utilityNav}>
            <Button
              size="small"
              icon={
                <Icon name={colorMode === 'dark' ? 'sun' : 'moon'} size={16} />
              }
              variant="ghost"
              onClick={invertColorMode}
              className={styles.utilityLink}
            />

            <Link href="#whatsapp" className={styles.utilityLink}>
              <Icon name="brand-whatsapp" size={16} />
              Whatsapp
            </Link>

            <Link href="#portal" className={styles.utilityLink}>
              <Icon name="user" size={16} />
              Sou aluno
            </Link>

            <Link
              href="#track"
              className={clsx(styles.utilityLink, styles.trackEnrollment)}
            >
              Acompanhe sua inscrição
              <Icon name="arrow-right" size={16} />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
