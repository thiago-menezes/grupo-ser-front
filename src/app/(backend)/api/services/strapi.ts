/**
 * Strapi service for Next.js API routes
 * This service handles all Strapi-specific logic and query building
 * Frontend should never import this - use Next.js API routes instead
 */

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

/**
 * Build Strapi query string with proper bracket notation
 * Strapi v4 requires bracket notation in keys to NOT be URL encoded
 */
export function buildStrapiQuery(params: Record<string, unknown>): string {
  const queryParts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v, index) => {
        queryParts.push(`${key}[${index}]=${encodeURIComponent(String(v))}`);
      });
    } else if (value !== undefined && value !== null) {
      queryParts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  });

  return queryParts.join('&');
}

/**
 * Build Strapi filter query with bracket notation
 */
export function buildStrapiFilterQuery(
  filters: Record<string, unknown>,
): string {
  const queryParts: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value as Record<string, unknown>).forEach(
        ([nestedKey, nestedValue]) => {
          queryParts.push(
            `filters[${key}][${nestedKey}]=${encodeURIComponent(String(nestedValue))}`,
          );
        },
      );
    } else {
      queryParts.push(`filters[${key}]=${encodeURIComponent(String(value))}`);
    }
  });

  return queryParts.join('&');
}

/**
 * Build nested filter query string for Strapi
 * Handles deeply nested filters like filters[institution][slug][$eq]=value
 */
function buildNestedFilter(
  prefix: string,
  filters: Record<string, unknown>,
): string[] {
  const parts: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const valueObj = value as Record<string, unknown>;
      const keys = Object.keys(valueObj);

      // Check if ALL keys are operators (start with $)
      // If so, this is a leaf object with operators
      const allOperators =
        keys.length > 0 && keys.every((k) => k.startsWith('$'));

      if (allOperators) {
        // This is a leaf object with operators, build the full path
        Object.entries(valueObj).forEach(([opKey, opValue]) => {
          parts.push(
            `${fullKey}[${opKey}]=${encodeURIComponent(String(opValue))}`,
          );
        });
      } else {
        // This is a nested object, recursively process it
        const nestedParts = buildNestedFilter(fullKey, valueObj);
        parts.push(...nestedParts);
      }
    } else {
      // Handle primitive values
      parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts;
}

/**
 * Fetch data from Strapi API
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  options?: {
    filters?: Record<string, unknown>;
    populate?: string | string[];
    sort?: string | string[];
    params?: Record<string, unknown>;
  },
  noCache?: boolean,
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL environment variable is not configured');
  }

  const queryParts: string[] = [];

  // Add filters with proper nested bracket notation
  if (options?.filters) {
    const filterParts = buildNestedFilter('filters', options.filters);
    queryParts.push(...filterParts);
  }

  // Add populate
  if (options?.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach((field, index) => {
        queryParts.push(`populate[${index}]=${field}`);
      });
    } else {
      queryParts.push(`populate=${options.populate}`);
    }
  }

  // Add sort
  if (options?.sort) {
    if (Array.isArray(options.sort)) {
      options.sort.forEach((field, index) => {
        queryParts.push(`sort[${index}]=${field}`);
      });
    } else {
      queryParts.push(`sort=${options.sort}`);
    }
  }

  // Add other params
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      queryParts.push(`${key}=${encodeURIComponent(String(value))}`);
    });
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const url = `${STRAPI_URL}/api/${endpoint}${queryString}`;

  // In development or when noCache is true, use shorter cache or no cache
  const revalidate =
    noCache || process.env.NODE_ENV === 'development' ? 0 : 3600;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add Strapi authorization token if available
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      // Add cache-busting header in development
      ...(noCache || process.env.NODE_ENV === 'development'
        ? { 'Cache-Control': 'no-cache' }
        : {}),
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Strapi API request failed: ${response.status} ${response.statusText}. ${errorText}`,
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Get Strapi base URL
 */
export function getStrapiBaseUrl(): string {
  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL environment variable is not configured');
  }
  return STRAPI_URL;
}
