'use client';

import { useState } from 'react';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import styles from './styles.module.scss';
import { TopBar } from './top-bar';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <TopBar />

      <MainNav
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />

      <MobileNav mobileMenuOpen={mobileMenuOpen} />
    </header>
  );
};
