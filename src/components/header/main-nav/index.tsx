import Image from 'next/image';
import Link from 'next/link';
import { Button, DropdownMenu, useTheme } from 'reshaped';
import { useCityContext } from '@/contexts/city';
import { useCurrentInstitution } from '@/hooks';
import { Icon } from '../..';
import styles from '../styles.module.scss';
import mainNavStyles from './styles.module.scss';

export const MainNav = ({
  setMobileMenuOpen,
  mobileMenuOpen,
}: {
  setMobileMenuOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
}) => {
  const { institutionId, institutionName } = useCurrentInstitution();
  const { colorMode } = useTheme();
  const { city } = useCityContext();

  const isDarkMode = colorMode === 'dark';

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
    <div className={styles.mainNav}>
      <div className={styles.container}>
        <div className={styles.mainNavContent}>
          <Link href={`/${institutionId}`} className={styles.logo}>
            <Image
              src={`/logos/${institutionId}/${isDarkMode ? 'dark' : 'light'}.svg`}
              alt={`Logo ${institutionName}`}
              className={styles.logoImage}
              width={200}
              height={48}
              priority
              unoptimized
            />
          </Link>

          <div className={styles.rightContainer}>
            <nav className={styles.desktopNav} aria-label="Main navigation">
              <Link href={buildGraduationUrl()}>
                <Button size="large" variant="ghost">
                  Graduação
                </Button>
              </Link>

              <Link href={buildPostgraduateUrl()}>
                <Button size="large" variant="ghost">
                  Pós-Graduação
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenu.Trigger>
                  {(attributes) => (
                    <Button
                      size="large"
                      variant="ghost"
                      attributes={attributes}
                      aria-haspopup="true"
                      endIcon={<Icon name="chevron-down" />}
                    >
                      Nossos cursos
                    </Button>
                  )}
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                  <DropdownMenu.Item size="large">
                    Mais acessados
                  </DropdownMenu.Item>
                  <DropdownMenu.Item size="large">
                    Vestibular 2025
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenu.Trigger>
                  {(attributes) => (
                    <Button
                      size="large"
                      variant="ghost"
                      attributes={attributes}
                      aria-haspopup="true"
                      endIcon={<Icon name="chevron-down" />}
                    >
                      A {institutionName}
                    </Button>
                  )}
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                  <DropdownMenu.Item size="large">Endereço</DropdownMenu.Item>
                  <DropdownMenu.Item size="large">Contato</DropdownMenu.Item>
                  <DropdownMenu.Item size="large">Sobre nós</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenu.Trigger>
                  {(attributes) => (
                    <Button
                      size="large"
                      variant="ghost"
                      attributes={attributes}
                      aria-haspopup="true"
                      endIcon={<Icon name="chevron-down" />}
                    >
                      Formas de ingresso
                    </Button>
                  )}
                </DropdownMenu.Trigger>

                <DropdownMenu.Content>
                  <DropdownMenu.Item size="large">FIES</DropdownMenu.Item>
                  <DropdownMenu.Item size="large">Prouni</DropdownMenu.Item>
                  <DropdownMenu.Item size="large">Vestibular</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </nav>

            <Link href={`/${institutionId}/cursos`}>
              <Button size="large" className={mainNavStyles.secondaryButton}>
                Inscreva-se
              </Button>
            </Link>

            <button
              className={styles.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
