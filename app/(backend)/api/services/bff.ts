/**
 * BFF service initialization
 * Creates and configures BFF clients for use in Next.js API routes
 */

import { createClientApiClient } from '@/packages/bff/services/client-api';
import { createStrapiClient } from '@/packages/bff/services/strapi';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const CLIENT_API_BASE_URL = process.env.API_BASE_URL;

/**
 * Get Strapi client instance
 */
export function getStrapiClient() {
  if (!STRAPI_URL) {
    console.error('STRAPI_URL environment variable is not configured');
    console.log('Available env vars:', {
      STRAPI_URL: !!STRAPI_URL,
      NEXT_PUBLIC_STRAPI_URL: !!process.env.NEXT_PUBLIC_STRAPI_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
    throw new Error('STRAPI_URL environment variable is not configured');
  }

  return createStrapiClient(STRAPI_URL, STRAPI_TOKEN);
}

/**
 * Get Client API client instance
 */
export function getClientApiClient() {
  if (!CLIENT_API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not configured');
    throw new Error('API_BASE_URL environment variable is not configured');
  }

  return createClientApiClient(CLIENT_API_BASE_URL);
}
