/**
 * GET /api/courses
 * Endpoint de busca de cursos com filtros e paginacao
 *
 * Query params:
 * - nivel: 'graduacao' | 'pos-graduacao'
 * - cidade: string
 * - estado: string
 * - curso: string (busca parcial)
 * - modalidades: string[] (presencial, ead, semipresencial)
 * - turnos: string[] (manha, tarde, noite, integral, virtual)
 * - duracoes: string[] (1-2, 2-3, 3-4, 4+)
 * - precoMin: number
 * - precoMax: number
 * - page: number (default: 1)
 * - perPage: number (default: 12)
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
  CoursesSearchParams,
  CoursesSearchResponse,
  CoursesSearchErrorDTO,
} from 'types/api/courses-search';
import { handleCoursesSearch } from '@/packages/bff/handlers/courses/search-handler';
import { createCoursesApiClient } from '@/packages/bff/services/courses-api';

/**
 * Parse query params para CoursesSearchParams
 */
function parseSearchParams(searchParams: URLSearchParams): CoursesSearchParams {
  const params: CoursesSearchParams = {};

  // Nivel
  const level = searchParams.get('level');
  if (level === 'undergraduate' || level === 'graduate') {
    params.level = level;
  }

  // Cidade e Estado
  const city = searchParams.get('city');
  if (city) params.city = city;

  const state = searchParams.get('state');
  if (state) params.state = state;

  // Nome do curso
  const course = searchParams.get('course');
  if (course) params.course = course;

  // Modalidades (array)
  const modalities = searchParams.getAll('modalities');
  if (modalities.length > 0) {
    params.modalities = modalities;
  }

  // Turnos (array)
  const shifts = searchParams.getAll('shifts');
  if (shifts.length > 0) {
    params.shifts = shifts;
  }

  // Duracoes (array)
  const durations = searchParams.getAll('durations');
  if (durations.length > 0) {
    params.durations = durations;
  }

  // Preco min/max
  const minPrice = searchParams.get('minPrice');
  if (minPrice) {
    const parsed = parseFloat(minPrice);
    if (!isNaN(parsed)) params.minPrice = parsed;
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) {
    const parsed = parseFloat(maxPrice);
    if (!isNaN(parsed)) params.maxPrice = parsed;
  }

  // Pagination
  const page = searchParams.get('page');
  if (page) {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) params.page = parsed;
  }

  const perPage = searchParams.get('perPage');
  if (perPage) {
    const parsed = parseInt(perPage, 10);
    if (!isNaN(parsed) && parsed > 0) params.perPage = parsed;
  }

  return params;
}

export async function GET(request: NextRequest) {
  try {
    // Validar variavel de ambiente
    const coursesApiBaseUrl = process.env.COURSES_API_BASE_URL;
    if (!coursesApiBaseUrl) {
      console.error('COURSES_API_BASE_URL nao configurada');
      return NextResponse.json<CoursesSearchErrorDTO>(
        {
          error: 'Service configuration error',
          message: 'Courses API URL not configured',
        },
        { status: 500 },
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);

    // Criar cliente da API fake
    const coursesApiClient = createCoursesApiClient(coursesApiBaseUrl);

    // Executar busca
    const result = await handleCoursesSearch(coursesApiClient, params);

    // Retornar resposta com cache
    return NextResponse.json<CoursesSearchResponse>(result, {
      headers: {
        // Cache por 5 minutos, stale-while-revalidate por 1 hora
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error in courses search:', error);

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CoursesSearchErrorDTO>(
      {
        error: 'Failed to search courses',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
