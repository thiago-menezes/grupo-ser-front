export function setupPrismIntegration() {
  vi.doMock('@/libs/api/axios', () => ({
    query: async (url: string) => {
      if (url === '/products/search') {
        return {
          results: [
            {
              id: 'prod_123',
              name: 'Premium Coffee Beans',
              price: 24.99,
              description: 'Single origin coffee beans from Brazil',
              category: 'coffee',
              inStock: true,
              rating: 4.8,
              images: ['/images/coffee-brazil.jpg'],
              tags: ['single-origin', 'premium'],
            },
            {
              id: 'prod_124',
              name: 'French Press',
              price: 35.99,
              description: 'High quality French press for perfect coffee',
              category: 'equipment',
              inStock: true,
              rating: 4.6,
              images: ['/images/french-press.jpg'],
              tags: ['equipment', 'brewing'],
            },
          ],
          total: 2,
          page: 1,
          totalPages: 1,
        };
      }

      throw new Error(`Mock not configured for endpoint: ${url}`);
    },
  }));
}

export function setupIntegrationTest(options?: {
  baseUrl?: string;
  mockError?: boolean;
  errorMessage?: string;
}) {
  if (options?.mockError) {
    setupPrismIntegrationWithError(options.errorMessage);
  } else {
    setupPrismIntegration();
  }
}

export function setupPrismIntegrationWithError(errorMessage = 'Network error') {
  vi.doMock('@/libs/api/axios', () => ({
    query: async () => {
      throw new Error(errorMessage);
    },
  }));
}

export const INTEGRATION_TEST_TIMEOUT = 15000;

export const INTEGRATION_WAIT_OPTIONS = {
  timeout: 10000,
  interval: 500,
};
