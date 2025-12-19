export type HealthCheckSeoApiTestDTO = {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  dataLength?: number;
  error?: string;
};

export type HealthCheckSeoDTO = {
  timestamp: string;
  environment: string;
  vercelUrl?: string;
  strapiUrl?: string;
  strapiToken: string;
  apiBaseUrl?: string;
  nextAuthUrl?: string;
  seoApiTest?: HealthCheckSeoApiTestDTO;
};
