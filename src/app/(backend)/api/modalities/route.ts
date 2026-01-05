import { NextRequest, NextResponse } from 'next/server';
import { handleModalities } from '@/bff/handlers/modalidades/handler';
import type { ModalitiesResponseDTO } from '@/bff/handlers/modalidades/types';
import { ensureBffInitialized } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    ensureBffInitialized();
    const data = await handleModalities({
      institutionSlug,
      noCache,
    });

    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json<ModalitiesResponseDTO>(data, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch modalities',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
