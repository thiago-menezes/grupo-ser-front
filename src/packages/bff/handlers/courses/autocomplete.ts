import {
  AutocompleteQueryParams,
  AutocompleteResponse,
} from 'types/api/autocomplete';
import { courses, type Course } from '../../data';
import { searchCities, formatCityValue } from '../../services/cities';

/**
 * Handle autocomplete request
 */
export async function handleAutocomplete(
  params: AutocompleteQueryParams,
): Promise<AutocompleteResponse> {
  const query = params.q || '';

  if (params.type === 'cities') {
    const cities = await searchCities(query);

    return {
      type: 'cities',
      results: cities.map((city) => ({
        label: `${city.city} - ${city.state}`,
        value: formatCityValue(city.city, city.state),
        city: city.city,
        state: city.state,
      })),
    };
  }

  if (params.type === 'courses') {
    const filtered = courses.filter((course: Course) =>
      course.name.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      type: 'courses',
      results: filtered.map((course: Course) => ({
        id: course.id,
        label: course.name,
        value: course.slug,
        slug: course.slug,
        level: course.level,
        type: course.type,
      })),
    };
  }

  throw new Error('Invalid type. Use "cities" or "courses"');
}
