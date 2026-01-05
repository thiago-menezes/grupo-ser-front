import { NextRequest, NextResponse } from 'next/server';
import { handleUnits, handleUnitById } from '@/bff/handlers';
import type { UnitsErrorDTO, UnitsResponseDTO } from '@/types/api/units';
import { ensureBffInitialized } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const unitIdParam = searchParams.get('unitId');

  if (!institutionSlug) {
    return NextResponse.json<UnitsErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    ensureBffInitialized();

    let strapiData;
    if (unitIdParam) {
      const unitId = parseInt(unitIdParam, 10);
      if (isNaN(unitId)) {
        return NextResponse.json<UnitsErrorDTO>(
          { error: 'unitId must be a valid number' },
          { status: 400 },
        );
      }
      strapiData = await handleUnitById({
        institutionSlug,
        unitId,
      });
    } else {
      strapiData = await handleUnits({ institutionSlug });
    }

    const transformedData: UnitsResponseDTO = {
      data: strapiData.data,
      meta: {
        pagination: {
          page: strapiData.meta.pagination?.page || 1,
          pageSize: strapiData.meta.pagination?.pageSize || 0,
          pageCount: strapiData.meta.pagination?.pageCount || 0,
          total: strapiData.meta.pagination?.total || 0,
        },
      },
    };

    return NextResponse.json<UnitsResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;
    return NextResponse.json<UnitsErrorDTO>(
      {
        error: 'Failed to fetch units',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
