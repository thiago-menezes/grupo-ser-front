import { NextRequest, NextResponse } from 'next/server';
import { handleInstitutionBySlug } from '@/bff/handlers';
import type {
  InstitutionsErrorDTO,
  InstitutionsResponseDTO,
} from '@/types/api/institutions';
import { ensureBffInitialized } from '../services/bff';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json<InstitutionsErrorDTO>(
        { error: 'Slug parameter is required' },
        { status: 400 },
      );
    }

    ensureBffInitialized();
    const institution = await handleInstitutionBySlug({ slug });

    if (!institution) {
      return NextResponse.json<InstitutionsErrorDTO>(
        { error: 'Institution not found' },
        { status: 404 },
      );
    }

    return NextResponse.json<InstitutionsResponseDTO>({ institution });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution:', error);
    return NextResponse.json<InstitutionsErrorDTO>(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
