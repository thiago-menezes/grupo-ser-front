import { NextRequest, NextResponse } from 'next/server';
import type {
  CoursesSearchParams,
  CoursesSearchResponse,
  CoursesSearchErrorDTO,
} from 'types/api/courses-search';
import { handleOffersSearch } from '@/bff/handlers/courses/offers-search-handler';
import { ensureBffInitialized } from '../services/bff';

function parseSearchParams(searchParams: URLSearchParams): CoursesSearchParams {
  const params: CoursesSearchParams = {};

  const level = searchParams.get('level');
  if (level === 'undergraduate' || level === 'graduate') {
    params.level = level;
  }

  const city = searchParams.get('city');
  if (city) params.city = city;

  const state = searchParams.get('state');
  if (state) params.state = state;

  const course = searchParams.get('course');
  if (course) params.course = course;

  const modalities = searchParams.getAll('modalities');
  if (modalities.length > 0) {
    params.modalities = modalities;
  }

  const shifts = searchParams.getAll('shifts');
  if (shifts.length > 0) {
    params.shifts = shifts;
  }

  const durations = searchParams.getAll('durations');
  if (durations.length > 0) {
    params.durations = durations;
  }

  const precoMin = searchParams.get('precoMin');
  if (precoMin) {
    const parsed = parseFloat(precoMin);
    if (!isNaN(parsed)) params.precoMin = parsed;
  }

  const precoMax = searchParams.get('precoMax');
  if (precoMax) {
    const parsed = parseFloat(precoMax);
    if (!isNaN(parsed)) params.precoMax = parsed;
  }

  const page = searchParams.get('page');
  if (page) {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) params.page = parsed;
  }

  const perPage = searchParams.get('perPage');
  if (perPage) {
    const parsed = parseInt(perPage, 10);
    if (!isNaN(parsed) && parsed > 0) params.perPage = parsed;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    ensureBffInitialized();

    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);

    const marca = searchParams.get('marca') || 'unama';

    const result = await handleOffersSearch(params, marca);

    return NextResponse.json<CoursesSearchResponse>(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error in courses search:', error);

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CoursesSearchErrorDTO>(
      {
        error: 'Failed to search courses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
