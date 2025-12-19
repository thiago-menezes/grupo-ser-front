import axios from 'axios';

export const createApiClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000, // Reduced to 10s for faster failure when server is down
    withCredentials: true,
  });

  client.interceptors.request.use(async (config) => {
    try {
      const controller = new AbortController();
      config.signal = controller.signal;
      const timeoutMs = config.timeout ?? 5000;
      setTimeout(() => controller.abort(), timeoutMs);

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Request error: ${error}`);
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();

export const query = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
) => {
  const { data } = await apiClient.get<T>(endpoint, { params });
  return data;
};

export const mutate = async <T, P>(
  endpoint: string,
  payload: P,
  method: 'post' | 'put' | 'delete' | 'patch' | 'get' = 'post',
) => {
  const { data } = await apiClient[method]<T>(endpoint, payload);
  return data;
};
