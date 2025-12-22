/**
 * Formats a city value in technical format "city:name-state:code" to display format "City - ST"
 * Also handles simple city names by capitalizing them properly
 *
 * @param value - City value (can be technical format, display format, or simple name)
 * @returns Formatted city display string "City - ST" or "City"
 *
 * @example
 * formatCityDisplayValue("city:recife-state:pe") // "Recife - PE"
 * formatCityDisplayValue("city:sao-jose-dos-campos-state:sp") // "São José dos Campos - SP"
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
    const formattedCity = toProperCase(cityName);

    return `${formattedCity} - ${stateCode}`;
  }

  const normalized = value.trim();
  const lastDash = normalized.lastIndexOf('-');
  if (lastDash > 0) {
    const citySlug = normalized.slice(0, lastDash);
    const stateCode = normalized.slice(lastDash + 1).toUpperCase();
    if (stateCode.length === 2) {
      const cityName = citySlug.replace(/-/g, ' ');
      const formattedCity = toProperCase(cityName);
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
  return toProperCase(value);
}

/**
 * Words that should remain lowercase in Portuguese proper names
 * (prepositions and articles)
 */
const LOWERCASE_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em']);

/**
 * Converts any text to proper case for Portuguese names (cities, courses, etc.)
 * Handles text in any case (lowercase, UPPERCASE, or mixed)
 * Prepositions and articles remain lowercase except when first word
 *
 * @param text - The text to convert (can be lowercase, UPPERCASE, or mixed)
 * @returns Properly cased text
 *
 * @example
 * toProperCase("são paulo") // "São Paulo"
 * toProperCase("SÃO PAULO") // "São Paulo"
 * toProperCase("ADMINISTRAÇÃO DE EMPRESAS") // "Administração de Empresas"
 * toProperCase("ribeirão das neves") // "Ribeirão das Neves"
 */
export function toProperCase(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // First word is always capitalized
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Keep prepositions and articles lowercase
      if (LOWERCASE_WORDS.has(word)) {
        return word;
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
