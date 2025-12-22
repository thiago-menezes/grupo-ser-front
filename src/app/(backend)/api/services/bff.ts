import { initClientApi } from '@/bff/services/client-api';
import { initStrapi } from '@/bff/services/strapi';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const CLIENT_API_BASE_URL = process.env.API_BASE_URL;
const CLIENT_API_KEY = process.env.API_KEY;

let initialized = false;

export function initBff(): void {
  if (initialized) return;

  if (!STRAPI_URL) {
    console.error('STRAPI_URL environment variable is not configured');
    throw new Error('STRAPI_URL environment variable is not configured');
  }

  if (!CLIENT_API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not configured');
    throw new Error('API_BASE_URL environment variable is not configured');
  }

  initStrapi({
    baseUrl: STRAPI_URL,
    token: STRAPI_TOKEN,
    timeout: 10000,
  });

  initClientApi({
    baseUrl: CLIENT_API_BASE_URL,
    apiKey: CLIENT_API_KEY,
    timeout: 15000,
  });

  initialized = true;
}

export function ensureBffInitialized(): void {
  if (!initialized) {
    initBff();
  }
}
