import { NextRequest, NextResponse } from 'next/server';
import { transformClientUnits } from '@/packages/bff/transformers/client-api';
import type {
  CoursesUnitsErrorDTO,
  CoursesUnitsResponseDTO,
} from '@/types/api/courses-units';
import { getClientApiClient } from '../../services/bff';

/**
 * GET /api/courses/units
 * Fetch units available for a specific course
 *
 * Query params:
 * - institution: Institution slug (e.g., "unama")
 * - state: State abbreviation (e.g., "pa")
 * - city: City name (e.g., "ananindeua")
 * - courseId: Course ID (Client API Course_ID)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const courseId = searchParams.get('courseId') ?? searchParams.get('sku');

  if (!institution || !state || !city || !courseId) {
    return NextResponse.json<CoursesUnitsErrorDTO>(
      { error: 'institution, state, city, and courseId are required' },
      { status: 400 },
    );
  }

  try {
    const clientApiClient = getClientApiClient();
    const apiResponse = await clientApiClient.fetchUnitsByCourse(
      institution,
      state,
      city,
      courseId,
    );

    if (!apiResponse.Unidades || apiResponse.Unidades.length === 0) {
      return NextResponse.json<CoursesUnitsResponseDTO>({
        data: [],
        meta: { total: 0, institution, state, city, courseId },
      });
    }

    const transformedUnits = transformClientUnits(apiResponse.Unidades);

    return NextResponse.json<CoursesUnitsResponseDTO>(
      {
        data: transformedUnits,
        meta: {
          total: transformedUnits.length,
          institution,
          state,
          city,
          courseId,
        },
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    return NextResponse.json<CoursesUnitsErrorDTO>(
      {
        error: 'Failed to fetch units for course',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
