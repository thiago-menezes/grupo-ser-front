/**
 * Client API Service Client
 * Handles communication with the external client API for fetching units data
 */

export interface ClientApiConfig {
  baseUrl: string;
  timeout?: number;
}

/**
 * Client API Response Types (Portuguese field names from API)
 */
export interface ClientApiUnit {
  ID: number;
  Nome_Unidade: string;
  Estado: string;
  Cidade: string;
}

export interface ClientApiUnitsResponse {
  Unidades: ClientApiUnit[];
}

export interface OfertaEntrada {
  mesInicio: number;
  mesFim: number;
  Tipo: 'Percentual' | 'Valor';
  Valor: string;
}

export interface ValoresPagamento {
  ID: number;
  Valor: string;
  TemplateCampanha: string;
  OfertaEntrada: OfertaEntrada[];
  PrecoBase: string;
  Mensalidade: string;
  InicioVigencia: string;
  FimVigencia: string;
  PrioridadeAbrangencia: number;
}

export interface TiposPagamento {
  ID: number;
  Nome_TipoPagamento: string;
  Codigo: string;
  LinkCheckout: string;
  ValoresPagamento: ValoresPagamento[];
  PrecoBase?: string;
  Mensalidade?: string;
}

export interface FormasIngresso {
  ID: number;
  Nome_FormaIngresso: string;
  Codigo: string;
  TiposPagamento: TiposPagamento[];
}

export interface Turnos {
  ID: number;
  Nome_Turno: string;
  Periodo: string;
  FormasIngresso: FormasIngresso[];
  Hash_CursoTurno?: string;
}

export interface ClientApiCourse {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
}

export interface ClientApiCourseDetails {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
  Turnos: Turnos[];
}

export interface ClientApiCoursesResponse {
  Cursos: ClientApiCourse[];
}

/**
 * Client API Service Client
 * Framework-agnostic service for fetching data from client's legacy API
 */
export class ClientApiClient {
  private config: ClientApiConfig;

  constructor(config: ClientApiConfig) {
    this.config = config;
  }

  /**
   * Build URL with proper encoding for city names
   * Handles spaces and special characters in city names
   */
  private buildUnitsUrl(
    institution: string,
    state: string,
    city: string,
  ): string {
    // Normalize to lowercase as per API requirements
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();

    // URL encode city name to handle spaces and special characters
    // Example: "São José" -> "s%C3%A3o%20jos%C3%A9"
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/unidades`;
  }

  /**
   * Build URL for courses by unit
   * Handles spaces and special characters in city names
   */
  private buildCoursesUrl(
    institution: string,
    state: string,
    city: string,
    unitId: number,
  ): string {
    // Normalize to lowercase as per API requirements
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();

    // URL encode city name to handle spaces and special characters
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/unidades/${unitId}/cursos`;
  }

  /**
   * Build URL for course details
   */
  private buildCourseDetailsUrl(
    institution: string,
    state: string,
    city: string,
    unitId: number,
    courseId: string,
  ): string {
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/unidades/${unitId}/cursos/${courseId}`;
  }

  /**
   * Fetch units from client API
   */
  async fetchUnits(
    institution: string,
    state: string,
    city: string,
  ): Promise<ClientApiUnitsResponse> {
    const url = this.buildUnitsUrl(institution, state, city);

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching units');
    }
  }

  /**
   * Fetch courses for a specific unit from client API
   */
  async fetchCoursesByUnit(
    institution: string,
    state: string,
    city: string,
    unitId: number,
  ): Promise<ClientApiCoursesResponse> {
    const url = this.buildCoursesUrl(institution, state, city, unitId);

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching courses');
    }
  }

  /**
   * Fetch course details from client API
   */
  async fetchCourseDetails(
    institution: string,
    state: string,
    city: string,
    unitId: number,
    courseId: string,
  ): Promise<ClientApiCourseDetails> {
    const url = this.buildCourseDetailsUrl(
      institution,
      state,
      city,
      unitId,
      courseId,
    );

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching course details');
    }
  }

  /**
   * Build URL for units by course
   * /p/{institution}/{state}/{city}/cursos/{courseId}/unidades
   */
  private buildUnitsByCourseUrl(
    institution: string,
    state: string,
    city: string,
    courseId: string,
  ): string {
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/cursos/${courseId}/unidades`;
  }

  /**
   * Fetch units available for a specific course
   */
  async fetchUnitsByCourse(
    institution: string,
    state: string,
    city: string,
    courseId: string,
  ): Promise<ClientApiUnitsResponse> {
    const url = this.buildUnitsByCourseUrl(institution, state, city, courseId);

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching units by course');
    }
  }
}

/**
 * Create a Client API client instance
 */
export function createClientApiClient(baseUrl: string): ClientApiClient {
  return new ClientApiClient({
    baseUrl,
    timeout: 10000, // 10 seconds
  });
}
