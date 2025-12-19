import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ institution: string; courseId: string }>;
}): Promise<Metadata> {
  const { institution, courseId } = await params;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window === 'undefined'
        ? 'http://localhost:3000'
        : window.location.origin);

    const response = await fetch(
      `${baseUrl}/api/courses/details?courseId=${encodeURIComponent(courseId)}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return { title: 'Curso não encontrado' };
    }

    const course = await response.json();

    return {
      title: `${course.name} - ${institution}`,
      description:
        course.description || `Saiba mais sobre o curso ${course.name}`,
    };
  } catch {
    return { title: 'Curso' };
  }
}

export default function CourseDetailsLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
