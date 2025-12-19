import { NextRequest, NextResponse } from 'next/server';
import { handleHomePromoBanner } from '@/packages/bff/handlers/home-promo-banner';
import type {
  PromotionalBannersErrorDTO,
  PromotionalBannersResponseDTO,
} from '@/types/api/promotional-banners';
import { getStrapiClient } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<PromotionalBannersErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    const strapiClient = getStrapiClient();
    const strapiData = await handleHomePromoBanner(strapiClient, {
      institutionSlug,
      noCache,
    });

    const transformedData: PromotionalBannersResponseDTO = {
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

    return NextResponse.json<PromotionalBannersResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<PromotionalBannersErrorDTO>(
      {
        error: 'Failed to fetch promotional banners',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
