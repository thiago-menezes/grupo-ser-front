import { NextRequest, NextResponse } from 'next/server';
import { fetchUnitsByCourse } from '@/bff/handlers/units/api';
import { transformClientUnits } from '@/bff/transformers/client-api';
import type {
  CoursesUnitsErrorDTO,
  CoursesUnitsResponseDTO,
} from '@/types/api/courses-units';
import { ensureBffInitialized } from '../../services/bff';

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
    ensureBffInitialized();
    const apiResponse = await fetchUnitsByCourse(
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
