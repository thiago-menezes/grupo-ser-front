import { NextRequest, NextResponse } from 'next/server';
import { handleCourseDetailsFromStrapi } from '@/bff/handlers/courses';
import type {
  CourseBySkuErrorDTO,
  CourseBySkuResponseDTO,
} from '@/types/api/course-by-sku';
import { ensureBffInitialized } from '../../../services/bff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> },
) {
  try {
    const { sku } = await params;

    ensureBffInitialized();
    const strapiCourse = await handleCourseDetailsFromStrapi({
      courseId: sku,
    });

    if (!strapiCourse) {
      return NextResponse.json<CourseBySkuErrorDTO>(
        {
          error: 'Course not found',
          message: `Course with SKU '${sku}' was not found`,
          sku,
        },
        { status: 404 },
      );
    }

    return NextResponse.json<CourseBySkuResponseDTO>(strapiCourse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const { sku } = await params;
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CourseBySkuErrorDTO>(
      {
        error: 'Failed to fetch course details',
        message: error instanceof Error ? error.message : 'Unknown error',
        sku,
      },
      { status: statusCode },
    );
  }
}
