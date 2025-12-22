import { NextRequest, NextResponse } from 'next/server';
import { handleCitiesAutocomplete } from '@/bff/handlers/cities/autocomplete';
import { ensureBffInitialized } from '../../services/bff';

export type CitiesAutocompleteErrorDTO = {
  error: string;
  message?: string;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    ensureBffInitialized();
    const response = await handleCitiesAutocomplete(query);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json<CitiesAutocompleteErrorDTO>(
      {
        error: 'Failed to fetch cities autocomplete',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
