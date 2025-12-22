import { NextRequest, NextResponse } from 'next/server';
import { fetchCityCourses } from '@/bff/handlers/courses/client-handler';
import type {
  CoursesByCityErrorDTO,
  CoursesByCityResponseDTO,
} from '@/types/api/courses-by-city';
import { ensureBffInitialized } from '../../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');

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
    const modalities = searchParams.getAll('modalities');
    const shifts = searchParams.getAll('shifts');
    const durations = searchParams.getAll('durations');
    const courseName = searchParams.get('courseName') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '12', 10);

    ensureBffInitialized();
    const data = await fetchCityCourses({
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
