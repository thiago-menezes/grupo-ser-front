import { NextRequest, NextResponse } from 'next/server';
import { handleSearchBannerPromo } from '@/packages/bff/handlers/search-banner-promo';
import type {
  SearchBannerPromosErrorDTO,
  SearchBannerPromosResponseDTO,
} from '@/types/api/search-banner-promos';
import { getStrapiClient } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<SearchBannerPromosErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    const strapiClient = getStrapiClient();
    const strapiData = await handleSearchBannerPromo(strapiClient, {
      institutionSlug,
      noCache,
    });

    const transformedData: SearchBannerPromosResponseDTO = {
      data: strapiData.data.map((item) => ({
        id: item.id,
        link: item.link || null,
        imageUrl: item.imagem?.url || null,
        imageAlt: item.imagem?.alternativeText || null,
      })),
      meta: strapiData.meta,
    };

    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json<SearchBannerPromosResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<SearchBannerPromosErrorDTO>(
      {
        error: 'Failed to fetch search banner promotional data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
