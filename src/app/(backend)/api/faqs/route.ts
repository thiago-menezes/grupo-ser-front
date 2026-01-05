import { NextRequest, NextResponse } from 'next/server';
import { handlePerguntasFrequentes } from '@/bff/handlers/perguntas-frequentes';
import type { FaqsErrorDTO, FaqsResponseDTO } from '@/types/api/faqs';
import { ensureBffInitialized } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<FaqsErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    ensureBffInitialized();
    const strapiData = await handlePerguntasFrequentes({
      institutionSlug,
      noCache,
    });

    // strapiData already contains English DTOs due to the handler's transformer
    const transformedData: FaqsResponseDTO = {
      data: strapiData.data,
      meta: strapiData.meta,
    };

    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json<FaqsResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<FaqsErrorDTO>(
      {
        error: 'Failed to fetch FAQs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
