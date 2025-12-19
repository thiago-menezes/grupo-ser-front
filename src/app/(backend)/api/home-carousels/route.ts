import { NextRequest, NextResponse } from 'next/server';
import { handleHomeCarousel } from '@/bff/handlers/home-carousel';
import type {
  HomeCarouselResponseDTO,
  HomeCarouselsErrorDTO,
} from '@/types/api/home-carousels';
import { getStrapiClient } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<HomeCarouselsErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    const strapiClient = getStrapiClient();
    const strapiData = await handleHomeCarousel(strapiClient, {
      institutionSlug,
      noCache,
    });

    // Transform Strapi response to expected DTO format
    const transformedData: HomeCarouselResponseDTO = {
      data: strapiData.data.map((item) => ({
        id: item.id,
        name: item.nome || null,
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

    return NextResponse.json<HomeCarouselResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<HomeCarouselsErrorDTO>(
      {
        error: 'Failed to fetch home carousel data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
