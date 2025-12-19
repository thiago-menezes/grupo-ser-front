import type { CourseAPIRaw, JSONServerQueryParams } from './types';

export interface CoursesApiConfig {
  baseUrl: string;
  timeout?: number;
}

export class CoursesApiClient {
  private config: CoursesApiConfig;

  constructor(config: CoursesApiConfig) {
    this.config = config;
  }

  private buildCoursesUrl(params?: JSONServerQueryParams): string {
    const url = new URL(`${this.config.baseUrl}/cursos`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return url.toString();
  }

  async fetchCourses(params?: JSONServerQueryParams): Promise<CourseAPIRaw[]> {
    const url = this.buildCoursesUrl(params);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 10000,
    );

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Courses API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      }

      if (data.cursos && Array.isArray(data.cursos)) {
        return data.cursos;
      }

      throw new Error('Invalid response format from Courses API');
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Courses API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching courses');
    }
  }
}

export function createCoursesApiClient(baseUrl: string): CoursesApiClient {
  return new CoursesApiClient({
    baseUrl,
    timeout: 15000,
  });
}
