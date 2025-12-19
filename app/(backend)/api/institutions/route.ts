import { NextRequest, NextResponse } from 'next/server';
import { transformInstitution } from '@/packages/bff/transformers/strapi';
import type {
  InstitutionsErrorDTO,
  InstitutionsResponseDTO,
} from '@/types/api/institutions';

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

    // Fetch from Strapi
    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    const strapiToken = process.env.STRAPI_TOKEN;

    const response = await fetch(
      `${strapiUrl}/api/institutions?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json<InstitutionsErrorDTO>(
        { error: 'Institution not found' },
        { status: 404 },
      );
    }

    const strapiInstitution = data.data[0];
    const institution = transformInstitution(strapiInstitution);

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
