import { NextRequest, NextResponse } from 'next/server';
import { handleClientUnits } from '@/packages/bff/handlers/units';
import type {
  UnitsClientErrorDTO,
  UnitsClientResponseDTO,
} from '@/types/api/units-client';
import { getClientApiClient } from '../../services/bff';

/**
 * GET /api/units/client
 * Fetch units from client API by geographic location
 *
 * Query params:
 * - institution: Institution slug (e.g., "unama")
 * - state: State abbreviation (e.g., "pa")
 * - city: City name (e.g., "Ananindeua" or "São José")
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');

  // Validate required parameters
  if (!institution) {
    return NextResponse.json<UnitsClientErrorDTO>(
      { error: 'institution query parameter is required' },
      { status: 400 },
    );
  }

  if (!state) {
    return NextResponse.json<UnitsClientErrorDTO>(
      { error: 'state query parameter is required' },
      { status: 400 },
    );
  }

  if (!city) {
    return NextResponse.json<UnitsClientErrorDTO>(
      { error: 'city query parameter is required' },
      { status: 400 },
    );
  }

  try {
    const clientApiClient = getClientApiClient();
    const data = await handleClientUnits(clientApiClient, {
      institution,
      state,
      city,
    });

    return NextResponse.json<UnitsClientResponseDTO>(data, {
      headers: {
        // Cache for 1 hour, stale-while-revalidate for 24 hours
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<UnitsClientErrorDTO>(
      {
        error: 'Failed to fetch units from client API',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
