export type StrapiSeo = {
  id: number;
  documentId: string;
  metadata: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
      url: string;
      siteName: string;
      type: string;
      locale: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      images: string[];
    };
    alternates: {
      canonical: string;
      languages: {
        'pt-BR': string;
        [key: string]: string;
      };
    };
    robots: {
      index: boolean;
      follow: boolean;
      googleBot: {
        index: boolean;
        follow: boolean;
        'max-video-preview': number;
        'max-image-preview': string;
        'max-snippet': number;
      };
    };
    verification: {
      google: string;
    };
    category: string;
    other: {
      'article:publisher': string;
      'article:author': string;
      [key: string]: string;
    };
  };
  jsonld: {
    '@context': string;
    '@type': string;
    name: string;
    alternateName: string;
    url: string;
    logo: string;
    description: string;
    address: {
      '@type': string;
      addressCountry: string;
      [key: string]: string;
    };
    telephone: string;
    sameAs: string[];
    offers: {
      '@type': string;
      priceCurrency: string;
      [key: string]: string;
    };
    parentOrganization: {
      '@type': string;
      name: string;
      [key: string]: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  instituicao: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    code: string;
    description: string;
    website: string;
    primaryColor: string;
    secondaryColor: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

export type StrapiSeoResponse = {
  data: Array<StrapiSeo>;
};
