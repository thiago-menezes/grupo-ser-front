import { NextRequest, NextResponse } from 'next/server';
import { handleCourseDetailsFromStrapi } from '@/bff/handlers/courses';
import type {
  CourseDetailsErrorDTO,
  CourseDetailsResponseDTO,
} from '@/types/api/course-details';
import { ensureBffInitialized } from '../../services/bff';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        { error: 'courseId query parameter is required' },
        { status: 400 },
      );
    }

    ensureBffInitialized();

    const courseDetails = await handleCourseDetailsFromStrapi({ courseId });

    if (!courseDetails) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        {
          error: 'Course not found',
          message: `No course found for courseId: ${courseId}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json<CourseDetailsResponseDTO>(courseDetails, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CourseDetailsErrorDTO>(
      {
        error: 'Failed to fetch course details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
