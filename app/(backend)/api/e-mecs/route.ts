import { NextRequest, NextResponse } from 'next/server';
import { handleEMec } from '@/packages/bff/handlers/e-mec';
import type { EMecErrorDTO, EMecResponseDTO } from '@/types/api/e-mecs';
import { getStrapiClient } from '../services/bff';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const institutionSlug = searchParams.get('institutionSlug');
  const noCache = searchParams.get('noCache') === 'true';

  if (!institutionSlug) {
    return NextResponse.json<EMecErrorDTO>(
      { error: 'institutionSlug query parameter is required' },
      { status: 400 },
    );
  }

  try {
    const strapiClient = getStrapiClient();
    const strapiData = await handleEMec(strapiClient, {
      institutionSlug,
      noCache,
    });

    // Transform Strapi response to expected DTO format
    const transformedData: EMecResponseDTO = {
      data: strapiData.data.map((item) => ({
        id: item.id,
        link: item.link || null,
        qrcodeUrl: item.qrcode?.url || null,
        qrcodeAlt: item.qrcode?.alternativeText || 'QR Code e-MEC',
      })),
      meta: strapiData.meta,
    };

    const cacheControl =
      process.env.NODE_ENV === 'development' || noCache
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, s-maxage=3600, stale-while-revalidate=86400';

    return NextResponse.json<EMecResponseDTO>(transformedData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache-Status': noCache ? 'bypassed' : 'cached',
      },
    });
  } catch (error) {
    return NextResponse.json<EMecErrorDTO>(
      {
        error: 'Failed to fetch e-MEC data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
