import { useMutation } from '@tanstack/react-query';
import type { CourseSearchQueryDTO } from './types';

async function submitQuickSearch(
  data: CourseSearchQueryDTO,
  institutionSlug: string,
) {
  const params = new URLSearchParams();

  if (data.city) params.append('city', data.city);
  if (data.course) params.append('course', data.course);
  if (data.modalities?.length) {
    data.modalities.forEach((m) => params.append('modalities', m));
  }

  return {
    success: true,
    searchUrl: `/${institutionSlug}/cursos?${params.toString()}`,
  };
}

export function useQuickSearchMutation(institutionSlug: string) {
  return useMutation({
    mutationFn: (data: CourseSearchQueryDTO) =>
      submitQuickSearch(data, institutionSlug),
    retry: 1,
  });
}

async function trackHeroInteraction(
  eventType: string,
  eventData: Record<string, unknown>,
) {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventType,
        data: eventData,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Silently fail analytics tracking
  }
}

export function useTrackHeroInteraction() {
  return useMutation({
    mutationFn: ({
      eventType,
      eventData,
    }: {
      eventType: string;
      eventData: Record<string, unknown>;
    }) => trackHeroInteraction(eventType, eventData),
    retry: 0,
  });
}
