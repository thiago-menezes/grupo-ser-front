import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import 'reshaped/bundle.css';
import './icon/tabler-300.css';
import '@/styles/global.scss';
import { Footer, Header } from '@/components';
import { generateJsonLd, generateMetadata } from '@/features/seo';
import Providers from './providers';

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

export async function generateStaticParams() {
  // Generate static params for all known institutions to avoid build-time CMS calls
  // This allows the pages to be statically generated with fallback
  const institutions = [
    'unama',
    'ung',
    'uni7',
    'unifael',
    'uninassau',
    'uninorte',
  ];

  return institutions.map((institution) => ({
    institution,
  }));
}

export { generateMetadata };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const institution = process.env.NEXT_PUBLIC_INSTITUTION || '';
  const jsonLd = await generateJsonLd(institution);

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
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
