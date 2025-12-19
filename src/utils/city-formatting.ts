/**
 * Formats a city value in technical format "city:name-state:code" to display format "City - ST"
 * Also handles simple city names by capitalizing them properly
 *
 * @param value - City value (can be technical format, display format, or simple name)
 * @returns Formatted city display string "City - ST" or "City"
 *
 * @example
 * formatCityDisplayValue("city:recife-state:pe") // "Recife - PE"
 * formatCityDisplayValue("city:sao-jose-dos-campos-state:sp") // "São José Dos Campos - SP"
 * formatCityDisplayValue("Recife - PE") // "Recife - PE"
 * formatCityDisplayValue("recife") // "Recife"
 * formatCityDisplayValue("sao paulo") // "São Paulo"
 */
export function formatCityDisplayValue(value: string): string {
  if (!value) return '';

  // Check if value is in technical format "city:name-state:code"
  const techFormatMatch = value.match(/^city:(.+?)-state:([a-z]{2})$/i);

  if (techFormatMatch) {
    const citySlug = techFormatMatch[1];
    const stateCode = techFormatMatch[2].toUpperCase();
    const cityName = citySlug.replace(/-/g, ' ');

    // Format city name: capitalize each word
    const formattedCity = formatCityName(cityName);

    return `${formattedCity} - ${stateCode}`;
  }

  const normalized = value.trim();
  const lastDash = normalized.lastIndexOf('-');
  if (lastDash > 0) {
    const citySlug = normalized.slice(0, lastDash);
    const stateCode = normalized.slice(lastDash + 1).toUpperCase();
    if (stateCode.length === 2) {
      const cityName = citySlug.replace(/-/g, ' ');
      const formattedCity = formatCityName(cityName);
      return `${formattedCity} - ${stateCode}`;
    }
  }

  // Check if already in display format "City - ST"
  const displayFormatMatch = value.match(/^(.+?)\s*-\s*([A-Z]{2})$/);
  if (displayFormatMatch) {
    // Already formatted, just return as-is
    return value;
  }

  // Simple city name - capitalize it
  return formatCityName(value);
}

/**
 * Capitalizes each word in a city name
 * Handles special cases like "de", "da", "do", etc.
 */
function formatCityName(cityName: string): string {
  return cityName
    .split(' ')
    .map((word) => {
      // Handle special cases like "de", "da", "do", "dos", "das"
      const lowerWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
      if (lowerWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
