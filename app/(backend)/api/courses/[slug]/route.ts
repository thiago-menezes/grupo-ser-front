import { NextRequest, NextResponse } from 'next/server';
import { handleCourseDetailsFromStrapi } from '@/packages/bff/handlers/courses';
import type {
  CoursesSlugErrorDTO,
  CoursesSlugResponseDTO,
} from '@/types/api/courses-slug';
import { getStrapiClient } from '../../services/bff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const strapiClient = getStrapiClient();
    const response = await handleCourseDetailsFromStrapi(strapiClient, {
      courseSku: slug,
    });
    return NextResponse.json<CoursesSlugResponseDTO>(response);
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    return NextResponse.json<CoursesSlugErrorDTO>(
      {
        error: 'Failed to fetch course',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
