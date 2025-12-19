export function getMediaUrl(path: string | null): string {
  if (!path) return '';

  // If already a full URL, return as-is
  if (path.startsWith('http')) return path;

  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // In production, use CDN directly for better performance
  if (process.env.NODE_ENV === 'production') {
    return `https://assets.gruposer.com.br/${cleanPath}`;
  }

  // In development, use local proxy to Strapi
  return `/api/media/${cleanPath}`;
}
