import { NextResponse } from 'next/server';

/**
 * Health check endpoint for container orchestration (ECS, Kubernetes, etc.)
 *
 * Returns:
 * - 200 OK if all services are healthy
 * - 503 Service Unavailable if any critical service is down
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const checks = {
      status: 'ok',
      timestamp,
      version: process.env.npm_package_version || 'unknown',
      services: {
        strapi: await checkStrapi(),
        coursesApi: await checkCoursesApi(),
        clientApi: await checkClientApi(),
      },
    };

    // Check if all services are healthy
    const allHealthy = Object.values(checks.services).every(
      (service) => service.status === 'ok',
    );

    if (!allHealthy) {
      return NextResponse.json(checks, { status: 503 });
    }

    return NextResponse.json(checks, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp,
        error: String(error),
      },
      { status: 503 },
    );
  }
}

/**
 * Check Strapi CMS availability
 */
async function checkStrapi() {
  try {
    const strapiUrl = process.env.STRAPI_URL;
    if (!strapiUrl) {
      return { status: 'error', message: 'STRAPI_URL not configured' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${strapiUrl}/_health`, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      status: response.ok ? 'ok' : 'error',
      statusCode: response.status,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Courses API availability
 */
async function checkCoursesApi() {
  try {
    const apiUrl = process.env.COURSES_API_BASE_URL;
    if (!apiUrl) {
      return {
        status: 'warning',
        message: 'COURSES_API_BASE_URL not configured',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(apiUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      status: response.ok ? 'ok' : 'error',
      statusCode: response.status,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Client API availability
 */
async function checkClientApi() {
  try {
    const apiUrl = process.env.API_BASE_URL;
    if (!apiUrl) {
      return { status: 'warning', message: 'API_BASE_URL not configured' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(apiUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      status: response.ok ? 'ok' : 'error',
      statusCode: response.status,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simple health check endpoint (no external dependencies)
 * Useful for basic liveness probes
 */
export async function HEAD() {
  return new Response(null, { status: 200 });
}
