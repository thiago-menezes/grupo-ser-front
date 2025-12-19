import type { InfrastructureUnit } from './types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Sort units by proximity to user's location
 * If location is not available, sort alphabetically
 */
export function sortUnitsByProximity(
  units: InfrastructureUnit[],
  userCoordinates: { lat: number; lng: number } | null,
): InfrastructureUnit[] {
  if (!userCoordinates) {
    // Sort alphabetically when location is not available
    return [...units].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Calculate distance for each unit and sort by proximity
  const unitsWithDistance = units.map((unit) => {
    if (!unit.coordinates) {
      // Units without coordinates go to the end
      return { unit, distance: Infinity };
    }

    const distance = calculateDistance(
      userCoordinates.lat,
      userCoordinates.lng,
      unit.coordinates.lat,
      unit.coordinates.lng,
    );

    return { unit, distance };
  });

  // Sort by distance, then alphabetically for units with same distance
  unitsWithDistance.sort((a, b) => {
    if (a.distance === b.distance) {
      return a.unit.name.localeCompare(b.unit.name);
    }
    return a.distance - b.distance;
  });

  return unitsWithDistance.map(({ unit }) => unit);
}

/**
 * Sort units by proximity and mark the closest one as active
 * If location is not available, marks the first unit as active
 */
export function markClosestUnit(
  units: InfrastructureUnit[],
  userCoordinates: { lat: number; lng: number } | null,
): InfrastructureUnit[] {
  const sortedUnits = sortUnitsByProximity(units, userCoordinates);

  if (!userCoordinates) {
    // When location is not available, mark the first unit as active
    return sortedUnits.map((unit, index) => ({
      ...unit,
      isActive: index === 0,
    }));
  }

  // Find the first unit with coordinates (closest one)
  const closestUnit = sortedUnits.find((unit) => unit.coordinates);

  if (closestUnit) {
    return sortedUnits.map((unit) => ({
      ...unit,
      isActive: unit.id === closestUnit.id,
    }));
  }

  // No units with coordinates, mark the first unit as active
  return sortedUnits.map((unit, index) => ({
    ...unit,
    isActive: index === 0,
  }));
}
