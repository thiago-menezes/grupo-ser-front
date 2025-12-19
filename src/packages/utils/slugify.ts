/**
 * Converts a string to a URL-friendly slug
 * Handles Portuguese characters and special cases
 *
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug string
 *
 * @example
 * slugify("Ciências Exatas e da Terra") // "ciencias-exatas-e-da-terra"
 * slugify("Engenharia & Tecnologia") // "engenharia-tecnologia"
 * slugify("Análise e Desenvolvimento de Sistemas") // "analise-e-desenvolvimento-de-sistemas"
 */
export function slugify(text: string): string {
  if (!text) return '';

  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Replace accented characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace & with 'e'
      .replace(/&/g, '-e-')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove all non-word chars except hyphens
      .replace(/[^\w-]+/g, '')
      // Replace multiple hyphens with single hyphen
      .replace(/--+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
}
