import { NextRequest, NextResponse } from 'next/server';
import { handleMedia } from '@/packages/bff/handlers';
import type { MediaErrorDTO } from '@/types/api/media';
import { getStrapiClient } from '../../services/bff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  try {
    const strapiClient = getStrapiClient();
    const { buffer, contentType } = await handleMedia(strapiClient, { path });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('Failed') ? 500 : 500;
    return NextResponse.json<MediaErrorDTO>(
      {
        error: 'Failed to fetch media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
