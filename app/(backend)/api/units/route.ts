import { NextRequest, NextResponse } from 'next/server';
import { handleUnits, handleUnitById } from '@/packages/bff/handlers';
import { transformUnit } from '@/packages/bff/transformers/strapi';
import type { UnitsErrorDTO, UnitsResponseDTO } from '@/types/api/units';
import { getStrapiClient } from '../services/bff';

/**
 * GET /api/units
 * Fetch units from Strapi
 *
 * Query params:
 * - institutionSlug: Required
 * - unitId: Optional - if provided, fetches only that specific unit with photos
 */
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
    const strapiClient = getStrapiClient();

    // If unitId is provided, fetch specific unit
    let strapiData;
    if (unitIdParam) {
      const unitId = parseInt(unitIdParam, 10);
      if (isNaN(unitId)) {
        return NextResponse.json<UnitsErrorDTO>(
          { error: 'unitId must be a valid number' },
          { status: 400 },
        );
      }
      strapiData = await handleUnitById(strapiClient, {
        institutionSlug,
        unitId,
      });
    } else {
      // Fetch all units for institution
      strapiData = await handleUnits(strapiClient, { institutionSlug });
    }

    // Transform Portuguese field names to English DTOs
    const transformedData: UnitsResponseDTO = {
      data: strapiData.data.map(transformUnit),
      meta: strapiData.meta,
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
