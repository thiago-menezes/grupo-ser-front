import { AutocompleteQueryParams } from 'types/api/autocomplete';
import { CoursesQueryParams } from 'types/api/courses';
import { BffValidationError } from '../../utils/errors';

function parseInteger(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new BffValidationError(`Invalid numeric value: ${value}`);
  }
  return parsed;
}

function parseFloatNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    throw new BffValidationError(`Invalid numeric value: ${value}`);
  }
  return parsed;
}

export function parseCoursesQueryParams(
  searchParams: URLSearchParams,
): CoursesQueryParams {
  return {
    institution: searchParams.get('institution') || undefined,
    location: searchParams.get('location') || undefined,
    page: parseInteger(searchParams.get('page')),
    perPage: parseInteger(searchParams.get('perPage')),
    modality: parseInteger(searchParams.get('modality')),
    category: parseInteger(searchParams.get('category')),
    enrollmentOpen:
      searchParams.get('enrollmentOpen') !== null
        ? searchParams.get('enrollmentOpen') === 'true'
        : undefined,
    period: parseInteger(searchParams.get('period')),
    priceMin: parseFloatNumber(searchParams.get('priceMin')),
    priceMax: parseFloatNumber(searchParams.get('priceMax')),
    durationRange: searchParams.get('durationRange') as
      | '1-2'
      | '2-3'
      | '3-4'
      | '4+'
      | undefined,
    level: searchParams.get('level') as
      | 'graduacao'
      | 'pos-graduacao'
      | undefined,
    course: searchParams.get('course') || undefined,
  };
}

export function parseAutocompleteQueryParams(
  searchParams: URLSearchParams,
): AutocompleteQueryParams {
  const type = searchParams.get('type');

  if (type !== 'cities' && type !== 'courses') {
    throw new BffValidationError('Invalid type. Use "cities" or "courses".');
  }

  const q = searchParams.get('q') ?? '';

  return {
    type,
    q,
  };
}
