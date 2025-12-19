import categoriesData from './categories.json';
import coursesData from './courses.json';
import institutionsData from './institutions.json';
import modalitiesData from './modalities.json';
import periodsData from './periods.json';
import unitsData from './units.json';

// Types
export type Institution = (typeof institutionsData)[number];
export type Unit = (typeof unitsData)[number];
export type Category = (typeof categoriesData)[number];
export type Modality = (typeof modalitiesData)[number];
export type Period = (typeof periodsData)[number];
export type Course = (typeof coursesData)[number];

// Data exports
export const institutions = institutionsData;
export const units = unitsData;
export const categories = categoriesData;
export const modalities = modalitiesData;
export const periods = periodsData;
export const courses = coursesData;

// Helper functions

/**
 * Get all courses in a specific category
 */
export function getCoursesByCategory(categoryId: number): Course[] {
  return courses.filter((course) => course.categoryId === categoryId);
}

/**
 * Search courses by name
 */
export function searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return courses.filter(
    (course) =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.description?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get units by institution
 */
export function getUnitsByInstitution(institutionId: number): Unit[] {
  return units.filter((unit) => unit.institutionId === institutionId);
}

/**
 * Get institution by slug
 */
export function getInstitutionBySlug(slug: string): Institution | undefined {
  return institutions.find((inst) => inst.slug === slug);
}

/**
 * Get course by slug
 */
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

/**
 * Get all unique cities from units
 */
export function getAvailableCities(): Array<{ city: string; state: string }> {
  const cityMap = new Map<string, { city: string; state: string }>();
  units.forEach((unit) => {
    const key = `${unit.city}-${unit.state}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, { city: unit.city, state: unit.state });
    }
  });
  return Array.from(cityMap.values()).sort((a, b) =>
    a.city.localeCompare(b.city),
  );
}

/**
 * Extract years from duration string (e.g., "5 anos" -> 5)
 */
export function extractYearsFromDuration(duration: string): number | null {
  const match = duration.match(/(\d+)\s*ano/);
  return match ? parseInt(match[1], 10) : null;
}
