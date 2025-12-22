import { NextRequest, NextResponse } from 'next/server';
import { handleCoursesAutocomplete } from '@/bff/handlers/courses/courses-autocomplete';
import { ensureBffInitialized } from '../../services/bff';

export type CoursesAutocompleteErrorDTO = {
  error: string;
  message?: string;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marca = searchParams.get('marca') || undefined;
    const estado = searchParams.get('estado') || undefined;
    const cidade = searchParams.get('cidade') || undefined;
    const modalidade = searchParams.get('modalidade') || undefined;

    ensureBffInitialized();
    const response = await handleCoursesAutocomplete({
      marca,
      estado,
      cidade,
      modalidade,
    });

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    return NextResponse.json<CoursesAutocompleteErrorDTO>(
      {
        error: 'Failed to fetch courses autocomplete',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
