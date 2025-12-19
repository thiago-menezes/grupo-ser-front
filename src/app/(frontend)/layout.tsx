import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import 'reshaped/bundle.css';
import Providers from './providers';
import './icon/tabler-300.css';
import '@/styles/global.scss';

const inter = Inter({
  subsets: ['latin'],
});

const tablerIcons = localFont({
  src: [
    {
      path: './icon/fonts/tabler-icons-300-outline.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-tabler-icons',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Grupo SER - Portal Institucional',
  description: 'Portal multi-institucional do Grupo SER Educacional',
  icons: {
    icon: '/favicons/grupo-ser.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={tablerIcons.variable}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedColorMode = localStorage.getItem('rs-color-mode');
                  if (storedColorMode === 'dark' || storedColorMode === 'light') {
                    document.documentElement.setAttribute('data-rs-color-mode', storedColorMode);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
