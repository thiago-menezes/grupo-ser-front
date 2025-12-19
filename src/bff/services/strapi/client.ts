/**
 * Strapi service client
 * Framework-agnostic service for fetching data from Strapi CMS
 */

export type PopulateOption = string | string[] | Record<string, PopulateValue>;

export type PopulateValue = string | boolean | { populate?: PopulateOption };

export interface StrapiFetchOptions {
  filters?: Record<string, unknown>;
  populate?: PopulateOption;
  sort?: string | string[];
  params?: Record<string, unknown>;
}

export interface StrapiClientConfig {
  baseUrl: string;
  cacheRevalidate?: number;
  token?: string;
  timeout?: number;
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
 * Strapi API client
 */
export class StrapiClient {
  private config: StrapiClientConfig;

  constructor(config: StrapiClientConfig) {
    this.config = config;
  }

  /**
   * Fetch data from Strapi API
   */
  async fetch<T>(
    endpoint: string,
    options?: StrapiFetchOptions,
    noCache?: boolean,
  ): Promise<T> {
    const queryParts: string[] = [];

    // Add filters with proper nested bracket notation
    if (options?.filters) {
      const filterParts = buildNestedFilter('filters', options.filters);
      queryParts.push(...filterParts);
    }

    // Add populate
    if (options?.populate) {
      if (typeof options.populate === 'string') {
        queryParts.push(`populate=${options.populate}`);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach((field, index) => {
          queryParts.push(`populate[${index}]=${field}`);
        });
      } else if (typeof options.populate === 'object') {
        // Build nested populate recursively
        const buildPopulate = (
          obj: Record<string, unknown>,
          prefix = 'populate',
        ) => {
          Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'boolean') {
              queryParts.push(`${prefix}[${key}]=${value}`);
            } else if (
              typeof value === 'object' &&
              value !== null &&
              'populate' in value
            ) {
              // Nested populate
              queryParts.push(`${prefix}[${key}][populate]=true`);
              if (
                typeof value.populate === 'object' &&
                !Array.isArray(value.populate)
              ) {
                buildPopulate(
                  value.populate as Record<string, unknown>,
                  `${prefix}[${key}][populate]`,
                );
              }
            }
          });
        };
        buildPopulate(options.populate as Record<string, unknown>);
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
    const url = `${this.config.baseUrl}/api/${endpoint}${queryString}`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = this.config.timeout || 10000; // Default 10 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.token
            ? { Authorization: `Bearer ${this.config.token}` }
            : {}),
          ...(noCache ? { 'Cache-Control': 'no-cache' } : {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Strapi API request failed: ${response.status} ${response.statusText}. ${errorText}`,
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(
          `Strapi API request timeout after ${timeout}ms: ${url}`,
        );
      }
      throw error;
    }
  }

  /**
   * Get Strapi base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}

/**
 * Create a Strapi client instance
 */
export function createStrapiClient(
  baseUrl: string,
  token?: string,
  timeout = 10000,
): StrapiClient {
  return new StrapiClient({
    baseUrl,
    cacheRevalidate: 3600,
    token,
    timeout,
  });
}
