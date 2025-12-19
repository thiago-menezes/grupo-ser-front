import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components';
import { generateJsonLd, generateMetadata } from '@/features/seo';
import { isValidInstitution } from '@/packages/utils';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

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

// Removed 'force-dynamic' to enable ISR (Incremental Static Regeneration)
// Pages will be statically generated at build time and revalidated on-demand via webhook
export const dynamicParams = true;

export { generateMetadata };

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!institution) return null;

  if (!isValidInstitution(institution)) {
    return notFound();
  }

  const jsonLd = await generateJsonLd(institution);

  return (
    <>
      <Header />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
      <Footer />
    </>
  );
}
