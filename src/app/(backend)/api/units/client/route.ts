import { NextRequest, NextResponse } from 'next/server';
import { handleClientUnits } from '@/bff/handlers/units';
import type {
  UnitsClientErrorDTO,
  UnitsClientResponseDTO,
} from '@/types/api/units-client';
import { ensureBffInitialized } from '../../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institution = searchParams.get('institution');
  const state = searchParams.get('state');
  const city = searchParams.get('city');

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
    ensureBffInitialized();
    const data = await handleClientUnits({
      institution,
      state,
      city,
    });

    return NextResponse.json<UnitsClientResponseDTO>(data, {
      headers: {
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
