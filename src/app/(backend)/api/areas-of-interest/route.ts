import { NextRequest, NextResponse } from 'next/server';
import { handleAreasInteresse } from '@/bff/handlers/areas-interesse';
import type {
  AreasOfInterestErrorDTO,
  AreasOfInterestResponseDTO,
} from '@/types/api/areas-of-interest';
import { ensureBffInitialized } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<AreasOfInterestErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    ensureBffInitialized();
    const strapiData = await handleAreasInteresse({
      institutionSlug,
      noCache,
    });

    const transformedData: AreasOfInterestResponseDTO = {
      data: strapiData.data.map((item) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        imageUrl: item.image || null,
        imageAlt: 'Capa da área de interesse',
        courses: item.courses,
      })),
      meta: strapiData.meta,
    };

    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json<AreasOfInterestResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<AreasOfInterestErrorDTO>(
      {
        error: 'Failed to fetch areas of interest',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
