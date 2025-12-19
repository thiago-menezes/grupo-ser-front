import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for on-demand revalidation from Strapi
 *
 * Usage:
 * POST /api/revalidate
 * Authorization: Bearer <REVALIDATION_SECRET>
 * Body: { path?: string, tag?: string }
 *
 * Examples:
 * - Revalidate specific path: { "path": "/unama/cursos/engenharia" }
 * - Revalidate by tag: { "tag": "courses" }
 * - Revalidate both: { "path": "/unama", "tag": "institution-unama" }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
      console.error('REVALIDATION_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${secret}`) {
      console.warn('Unauthorized revalidation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { path, tag } = body;

    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Either path or tag must be provided' },
        { status: 400 },
      );
    }

    const revalidated: string[] = [];

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      revalidated.push(`path: ${path}`);
      console.log(`Revalidated path: ${path}`);
    }

    // Revalidate by tag (Next.js 16+ requires profile parameter)
    if (tag) {
      revalidateTag(tag, 'default');
      revalidated.push(`tag: ${tag}`);
      console.log(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      items: revalidated,
    });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 },
  );
}
