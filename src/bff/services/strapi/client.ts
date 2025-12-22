export type PopulateOption = string | string[] | Record<string, PopulateValue>;

export type PopulateValue = string | boolean | { populate?: PopulateOption };

export type StrapiFetchOptions = {
  filters?: Record<string, unknown>;
  populate?: PopulateOption;
  sort?: string | string[];
  params?: Record<string, unknown>;
};

export type StrapiConfig = {
  baseUrl: string;
  token?: string;
  timeout?: number;
};

let config: StrapiConfig | null = null;

export function initStrapi(cfg: StrapiConfig): void {
  config = cfg;
}

export function getConfig(): StrapiConfig {
  if (!config) throw new Error('Strapi not initialized');
  return config;
}

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
      const allOperators =
        keys.length > 0 && keys.every((k) => k.startsWith('$'));

      if (allOperators) {
        Object.entries(valueObj).forEach(([opKey, opValue]) => {
          parts.push(
            `${fullKey}[${opKey}]=${encodeURIComponent(String(opValue))}`,
          );
        });
      } else {
        parts.push(...buildNestedFilter(fullKey, valueObj));
      }
    } else {
      parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts;
}

function buildPopulate(
  obj: Record<string, unknown>,
  prefix = 'populate',
): string[] {
  const parts: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'boolean') {
      parts.push(`${prefix}[${key}]=${value}`);
    } else if (
      typeof value === 'object' &&
      value !== null &&
      'populate' in value
    ) {
      parts.push(`${prefix}[${key}][populate]=true`);
      if (
        typeof value.populate === 'object' &&
        !Array.isArray(value.populate)
      ) {
        parts.push(
          ...buildPopulate(
            value.populate as Record<string, unknown>,
            `${prefix}[${key}][populate]`,
          ),
        );
      }
    }
  });

  return parts;
}

function buildQuery(options?: StrapiFetchOptions): string {
  const parts: string[] = [];

  if (options?.filters) {
    parts.push(...buildNestedFilter('filters', options.filters));
  }

  if (options?.populate) {
    if (typeof options.populate === 'string') {
      parts.push(`populate=${options.populate}`);
    } else if (Array.isArray(options.populate)) {
      options.populate.forEach((field, index) => {
        parts.push(`populate[${index}]=${field}`);
      });
    } else if (typeof options.populate === 'object') {
      parts.push(...buildPopulate(options.populate as Record<string, unknown>));
    }
  }

  if (options?.sort) {
    if (Array.isArray(options.sort)) {
      options.sort.forEach((field, index) => {
        parts.push(`sort[${index}]=${field}`);
      });
    } else {
      parts.push(`sort=${options.sort}`);
    }
  }

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    });
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

export async function strapiFetch<T>(
  endpoint: string,
  options?: StrapiFetchOptions,
  noCache?: boolean,
): Promise<T> {
  const { baseUrl, token, timeout = 10000 } = getConfig();
  const query = buildQuery(options);
  const url = `${baseUrl}/api/${endpoint}${query}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(noCache && { 'Cache-Control': 'no-cache' }),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Strapi error: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Strapi timeout after ${timeout}ms: ${url}`);
    }
    throw error;
  }
}

export function getStrapiBaseUrl(): string {
  return getConfig().baseUrl;
}
