import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCityContext } from '@/contexts/city';
import { useGeolocation } from '@/hooks';
import { getMediaUrl } from '@/packages/utils';
import { useQueryClientUnits, useQueryUnitById } from './api/query';
import type { InfrastructureImage, InfrastructureUnit } from './types';
import { markClosestUnit } from './utils';

/**
 * Transform client API units to InfrastructureUnit format
 */
function transformClientUnits(
  units: Array<{ id: number; name: string; state: string; city: string }>,
): InfrastructureUnit[] {
  // Note: Client API doesn't provide coordinates
  // Units will appear without coordinates until user selects one
  return units.map((unit) => ({
    id: unit.id.toString(),
    name: unit.name,
    coordinates: {
      lat: 0, // Placeholder - could be enhanced with geocoding service
      lng: 0,
    },
    imageIds: [], // Images loaded separately from Strapi
  }));
}

/**
 * Hook for infrastructure with client API integration
 * Flow:
 * 1. Fetch units list from client API (by city/state)
 * 2. User selects a unit
 * 3. Fetch images for selected unit from Strapi (by unit ID)
 */
export const useInfrastructure = (preselectedUnitId?: number) => {
  const params = useParams<{ institution?: string }>();
  const institutionSlug = params.institution;

  const { city: contextCity, state: contextState } = useCityContext();
  const {
    coordinates,
    permissionDenied,
    requestPermission,
    isLoading: isGeoLoading,
  } = useGeolocation({
    manualCity: contextCity || null,
    manualState: contextState || null,
  });

  const city = contextCity;
  const state = contextState;

  // Step 1: Fetch units from client API
  const {
    data: clientUnitsResponse,
    error: clientError,
    isError: isClientError,
    isLoading: isClientLoading,
  } = useQueryClientUnits(institutionSlug, state, city, !!city && !!state);

  // Create a location-based key to reset state when location changes
  const locationKey = `${city}-${state}`;

  // State for selected unit - includes location key for automatic reset
  const [selectedState, setSelectedState] = useState<{
    locationKey: string;
    unitId: string | null;
  }>({ locationKey, unitId: null });

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Get current selected unit (auto-reset if location changed)
  const currentSelectedUnitId =
    selectedState.locationKey === locationKey ? selectedState.unitId : null;

  // Transform client units
  const units = useMemo(() => {
    if (!clientUnitsResponse?.data) return [];
    return transformClientUnits(clientUnitsResponse.data);
  }, [clientUnitsResponse]);

  // Sort units by proximity
  const sortedUnits = useMemo(
    () => markClosestUnit(units, coordinates),
    [units, coordinates],
  );

  // Auto-select first unit if no selection and no preselection
  const autoSelectedUnitId = useMemo(() => {
    if (preselectedUnitId || currentSelectedUnitId) return null;
    if (sortedUnits.length === 0) return null;
    const firstActiveUnit = sortedUnits.find((unit) => unit.isActive);
    return firstActiveUnit?.id || null;
  }, [sortedUnits, preselectedUnitId, currentSelectedUnitId]);

  // Final selected unit (priority: preselected > internal > auto)
  const finalSelectedUnitId =
    preselectedUnitId?.toString() ||
    currentSelectedUnitId ||
    autoSelectedUnitId;

  // Step 2: Fetch images for selected unit from Strapi
  const selectedUnitIdNum = finalSelectedUnitId
    ? parseInt(finalSelectedUnitId, 10)
    : undefined;
  const { data: strapiUnitResponse, isLoading: isStrapiLoading } =
    useQueryUnitById(selectedUnitIdNum, !!selectedUnitIdNum);

  // Extract images from Strapi unit
  const images: InfrastructureImage[] = useMemo(() => {
    if (!strapiUnitResponse?.data?.[0]?.photos) return [];

    const unit = strapiUnitResponse.data[0];
    return unit.photos.map((photo) => ({
      id: photo.id.toString(),
      src: getMediaUrl(photo.url),
      alt: photo.alternativeText || photo.caption || `${unit.name} - Foto`,
    }));
  }, [strapiUnitResponse]);

  const hasData = units.length > 0;

  const activeUnit = useMemo(() => {
    if (finalSelectedUnitId) {
      return sortedUnits.find((unit) => unit.id === finalSelectedUnitId);
    }
    return sortedUnits.find((unit) => unit.isActive);
  }, [sortedUnits, finalSelectedUnitId]);

  const unitImages = images; // All images belong to selected unit

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleCloseModal = () => {
    setSelectedImageId(null);
  };

  const handleUnitClick = (unitId: string) => {
    setSelectedState({ locationKey, unitId });
  };

  const mainImage = unitImages[0];
  const sideImages = unitImages.slice(1, 5);

  return {
    city,
    state,
    location: clientUnitsResponse?.meta?.institution || '',
    permissionDenied,
    requestPermission,
    isLoading:
      isClientLoading ||
      isGeoLoading ||
      (!!finalSelectedUnitId && isStrapiLoading),
    hasData,
    selectedImage,
    selectedUnitId: finalSelectedUnitId,
    handleImageClick,
    handleCloseModal,
    handleUnitClick,
    mainImage,
    sideImages,
    sortedUnits,
    activeUnit,
    unitImages,
    selectedImageId,
    error: clientError,
    isError: isClientError,
  };
};
