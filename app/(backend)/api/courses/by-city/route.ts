import { NextRequest, NextResponse } from 'next/server';
import { fetchCityCourses } from '@/packages/bff/handlers/courses/client-handler';
import type {
  CoursesByCityErrorDTO,
  CoursesByCityResponseDTO,
} from '@/types/api/courses-by-city';
import { getClientApiClient } from '../../services/bff';

/**
 * GET /api/courses/by-city
 *
 * Query params:
 * - institution: Institution slug (e.g., "unama") [required]
 * - state: State abbreviation (e.g., "pa") [required]
 * - city: City name (e.g., "ananindeua") [required]
 * - modalities: Array of modality filters (e.g., ["presencial", "ead"])
 * - shifts: Array of shift filters (e.g., ["morning", "night"])
 * - durations: Array of duration ranges (e.g., ["1-2", "4-plus"])
 * - courseName: Course name search term
 * - page: Page number (default: 1)
 * - perPage: Items per page (default: 12)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');

  // Validate required parameters
  if (!institution) {
    return NextResponse.json<CoursesByCityErrorDTO>(
      { error: 'institution query parameter is required' },
      { status: 400 },
    );
  }

  if (!state) {
    return NextResponse.json<CoursesByCityErrorDTO>(
      { error: 'state query parameter is required' },
      { status: 400 },
    );
  }

  if (!city) {
    return NextResponse.json<CoursesByCityErrorDTO>(
      { error: 'city query parameter is required' },
      { status: 400 },
    );
  }

  try {
    // Parse optional parameters
    const modalities = searchParams.getAll('modalities');
    const shifts = searchParams.getAll('shifts');
    const durations = searchParams.getAll('durations');
    const courseName = searchParams.get('courseName') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '12', 10);

    const clientApiClient = getClientApiClient();
    const data = await fetchCityCourses(clientApiClient, {
      institution,
      estado: state,
      cidade: city,
      modalities: modalities.length > 0 ? modalities : undefined,
      shifts: shifts.length > 0 ? shifts : undefined,
      durations: durations.length > 0 ? durations : undefined,
      courseName,
      page,
      perPage,
    });

    return NextResponse.json<CoursesByCityResponseDTO>(data, {
      headers: {
        // Cache for 5 minutes, stale-while-revalidate for 6 hours
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=21600',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CoursesByCityErrorDTO>(
      {
        error: 'Failed to fetch courses by city',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
