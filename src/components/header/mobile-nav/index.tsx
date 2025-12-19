import { Button, Link } from 'reshaped';
import { useCityContext } from '@/contexts/city';
import { useCurrentInstitution } from '@/hooks';
import mainNavStyles from '../main-nav/styles.module.scss';
import styles from '../styles.module.scss';

export const MobileNav = ({ mobileMenuOpen }: { mobileMenuOpen: boolean }) => {
  const { institutionId, institutionName } = useCurrentInstitution();
  const { city } = useCityContext();

  const buildGraduationUrl = () => {
    const params = new URLSearchParams();
    params.append('courseLevel', 'graduation');
    if (city) {
      params.append('city', city);
    }
    return `/${institutionId}/cursos?${params.toString()}`;
  };

  const buildPostgraduateUrl = () => {
    const params = new URLSearchParams();
    params.append('courseLevel', 'postgraduate');
    if (city) {
      params.append('city', city);
    }
    return `/${institutionId}/cursos?${params.toString()}`;
  };

  return (
    <div
      className={`${styles.mobileNav} ${
        mobileMenuOpen ? styles.mobileNavOpen : ''
      }`}
    >
      <div className={styles.container}>
        <nav className={styles.mobileNavContent}>
          <Link href={buildGraduationUrl()} className={styles.mobileNavLink}>
            Graduação
          </Link>

          <Link href={buildPostgraduateUrl()} className={styles.mobileNavLink}>
            Pós-Graduação
          </Link>

          <Link
            href={`/${institutionId}/cursos`}
            className={styles.mobileNavLink}
          >
            Nossos cursos
          </Link>

          <Link
            href={`/${institutionId}/sobre`}
            className={styles.mobileNavLink}
          >
            A {institutionName}
          </Link>

          <Link
            href={`/${institutionId}/ingresso`}
            className={styles.mobileNavLink}
          >
            Formas de ingresso
          </Link>

          <Button
            href={`/${institutionId}/inscreva-se`}
            color="primary"
            fullWidth
            className={mainNavStyles.secondaryButton}
          >
            Inscreva-se
          </Button>
        </nav>
      </div>
    </div>
  );
};
