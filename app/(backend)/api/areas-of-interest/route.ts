import { NextRequest, NextResponse } from 'next/server';
import { handleAreasInteresse } from '@/packages/bff/handlers/areas-interesse';
import type {
  StrapiAreaInteresse,
  StrapiRichTextBlock,
} from '@/packages/bff/handlers/areas-interesse/types';
import { slugify } from '@/packages/utils';
import type {
  AreasOfInterestErrorDTO,
  AreasOfInterestResponseDTO,
} from '@/types/api/areas-of-interest';
import { getStrapiClient } from '../services/bff';

/**
 * Helper function to extract course names from Strapi rich text blocks
 */
function extractCoursesFromRichText(subareas: StrapiRichTextBlock[]): string[] {
  if (!subareas || !Array.isArray(subareas)) {
    return [];
  }

  return subareas
    .filter((block) => block.type === 'paragraph')
    .flatMap((block) =>
      block.children
        .filter((child) => child.type === 'text' && child.text?.trim())
        .map((child) => child.text.trim()),
    );
}

/**
 * Transform a single Strapi area to DTO format
 */
function transformAreaToDTO(area: StrapiAreaInteresse) {
  const courseNames = extractCoursesFromRichText(area.subareas || []);

  return {
    id: area.id,
    title: area.nome,
    slug: slugify(area.nome),
    imageUrl: area.capa?.url || null,
    imageAlt: area.capa?.alternativeText || null,
    courses: courseNames.map((name) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
    })),
  };
}

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
    const strapiClient = getStrapiClient();
    const strapiData = await handleAreasInteresse(strapiClient, {
      institutionSlug,
      noCache,
    });

    // Transform Strapi response to expected DTO format
    const transformedData: AreasOfInterestResponseDTO = {
      data: strapiData.data.map(transformAreaToDTO),
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
