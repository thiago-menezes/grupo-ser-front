import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

/**
 * Dynamic sitemap generation based on domain
 * Generates sitemap.xml at the root level for each domain
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') || 'unama.com.br';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // TODO: Fetch dynamic course URLs from Strapi/Courses API
  // This will be implemented after AWS migration
  // Example:
  // const courses = await fetchCoursesByInstitution(institution);
  // const courseUrls = courses.map((course) => ({
  //   url: `${baseUrl}/cursos/${course.slug}`,
  //   lastModified: course.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));
  // routes.push(...courseUrls);

  return routes;
}

export function getInstitutionFromHost(host: string): string {
  const domainMap: Record<string, string> = {
    'unama.com.br': 'unama',
    'www.unama.com.br': 'unama',
    'uninassau.com.br': 'uninassau',
    'www.uninassau.com.br': 'uninassau',
    'ung.edu.br': 'ung',
    'www.ung.edu.br': 'ung',
    'uninorte.com.br': 'uninorte',
    'www.uninorte.com.br': 'uninorte',
    'unifael.edu.br': 'unifael',
    'www.unifael.edu.br': 'unifael',
    'uni7.edu.br': 'uni7',
    'www.uni7.edu.br': 'uni7',
    'localhost:3000': 'grupo-ser',
    localhost: 'grupo-ser',
  };

  return domainMap[host] || 'grupo-ser';
}
