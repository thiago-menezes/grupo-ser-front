export type ApiConfig = {
  baseUrl: string;
  timeout?: number;
  apiKey?: string;
};

let config: ApiConfig | null = null;

export function initClientApi(cfg: ApiConfig): void {
  config = cfg;
}

export function getClientApiConfig(): ApiConfig {
  if (!config) throw new Error('Client API not initialized');
  return config;
}

export function buildClientApiUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const { baseUrl } = getClientApiConfig();
  const url = new URL(`${baseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  return url.toString();
}

export async function clientApiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const { timeout, apiKey } = getClientApiConfig();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout || 15000);

  try {
    const response = await fetch(url, {
      ...options,
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'x-api-key': apiKey }),
        ...options?.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }
    throw error;
  }
}

export async function createLead(data: unknown): Promise<void> {
  const url = buildClientApiUrl('/leads');
  await clientApiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
