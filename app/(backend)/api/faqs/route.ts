import { NextRequest, NextResponse } from 'next/server';
import { handlePerguntasFrequentes } from '@/packages/bff/handlers/perguntas-frequentes';
import type { StrapiPerguntaFrequente } from '@/packages/bff/handlers/perguntas-frequentes/types';
import type { FaqsErrorDTO, FaqsResponseDTO } from '@/types/api/faqs';
import { getStrapiClient } from '../services/bff';

/**
 * Transform a single Strapi FAQ to DTO format
 */
function transformFaqToDTO(faq: StrapiPerguntaFrequente) {
  return {
    id: faq.id,
    question: faq.pergunta,
    answer: faq.resposta,
  };
}

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
    const strapiClient = getStrapiClient();
    const strapiData = await handlePerguntasFrequentes(strapiClient, {
      institutionSlug,
      noCache,
    });

    const transformedData: FaqsResponseDTO = {
      data: strapiData.data.map(transformFaqToDTO),
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
