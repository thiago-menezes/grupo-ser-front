import { NextResponse } from 'next/server';
import type { HealthCheckSeoDTO } from '@/types/api/health-check-seo';

export async function GET() {
  const healthCheck: HealthCheckSeoDTO = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    vercelUrl: process.env.VERCEL_URL,
    strapiUrl: process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL,
    strapiToken: process.env.STRAPI_TOKEN ? 'configured' : 'missing',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  };

  try {
    // Test SEO API endpoint
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, '') ||
        'http://localhost:3000';

    const testUrl = `${baseUrl}/api/seos?institutionSlug=unama`;

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    healthCheck.seoApiTest = {
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    };

    if (response.ok) {
      const data = await response.json();
      healthCheck.seoApiTest.dataLength = data?.data?.length || 0;
    }
  } catch (error) {
    healthCheck.seoApiTest = {
      url: 'unknown',
      status: 0,
      statusText: 'Failed',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return NextResponse.json<HealthCheckSeoDTO>(healthCheck);
}
