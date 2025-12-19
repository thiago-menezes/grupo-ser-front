import { NextRequest, NextResponse } from 'next/server';
import {
  handleCourseDetailsFromStrapi,
  handleCourseDetailsWithClientApi,
} from '@/packages/bff/handlers/courses';
import type {
  CourseBySkuErrorDTO,
  CourseBySkuResponseDTO,
} from '@/types/api/course-by-sku';
import { getStrapiClient } from '../../../services/bff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> },
) {
  try {
    const { sku } = await params;
    const { searchParams } = new URL(request.url);

    // Extract query params for Client API
    const institution = searchParams.get('institution');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const unit = searchParams.get('unit');
    const admissionForm = searchParams.get('admissionForm');

    // Get base course data from Strapi
    const strapiClient = getStrapiClient();
    const strapiCourse = await handleCourseDetailsFromStrapi(strapiClient, {
      courseSku: sku,
    });

    // If we have all Client API params, enrich with pricing data
    if (institution && state && city && unit) {
      const enrichedCourse = await handleCourseDetailsWithClientApi(
        strapiCourse,
        {
          institution,
          state,
          city,
          unit,
          courseId: sku,
          admissionForm: admissionForm || undefined,
        },
      );

      return NextResponse.json<CourseBySkuResponseDTO>(enrichedCourse, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Return Strapi-only data
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
