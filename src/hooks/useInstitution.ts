'use client';

export const useCurrentInstitution = () => {
  // Get institution from environment variable (configured in AWS/Vercel)
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION || '';
  const institutionName = institutionId?.toUpperCase() || '';
  const institutionSlug = institutionId || '';

  return {
    institutionName,
    institutionId,
    institutionSlug,
  };
};
