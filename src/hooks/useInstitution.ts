'use client';

import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

export const useCurrentInstitution = () => {
  // Try to get institution from URL params first (path-based routing)
  const { institution: institutionId } = useParams<{ institution: string }>();

  // Fallback to cookie set by middleware (domain-based routing)
  const institutionFromCookie = Cookies.get('institution');

  // Use URL param if available, otherwise cookie, otherwise empty string
  const finalInstitutionId = institutionId || institutionFromCookie || '';

  const institutionName = finalInstitutionId?.toUpperCase() || '';
  const institutionSlug = finalInstitutionId || '';

  return {
    institutionName,
    institutionId: finalInstitutionId,
    institutionSlug,
  };
};
