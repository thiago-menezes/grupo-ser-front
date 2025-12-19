import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { CityAutocomplete } from '@/components';
import { useCityContext } from '@/contexts/city';
import type { CourseFiltersFormValues } from '../../types';

export type CityInputProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CityInput({ control }: CityInputProps) {
  // Watch the city field value
  const cityValue = useWatch({ control, name: 'city' });
  const { setCityState } = useCityContext();

  // Sync form value to context (and thus localStorage) when city changes
  useEffect(() => {
    if (cityValue) {
      const legacyMatch = cityValue.match(/^city:(.+?)-state:([a-z]{2})$/i);
      if (legacyMatch) {
        const cityName = legacyMatch[1].replace(/-/g, ' ');
        const stateCode = legacyMatch[2].toUpperCase();
        setCityState(cityName, stateCode, 'manual');
        return;
      }

      const normalized = cityValue.trim();
      const lastDash = normalized.lastIndexOf('-');
      if (lastDash > 0) {
        const cityName = normalized.slice(0, lastDash).replace(/-/g, ' ');
        const stateCode = normalized.slice(lastDash + 1).toUpperCase();
        if (stateCode.length === 2) {
          setCityState(cityName, stateCode, 'manual');
        }
      }
    }
  }, [cityValue, setCityState]);

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <CityAutocomplete
          value={cityValue || ''}
          onChange={field.onChange}
          name={field.name}
        />
      )}
    />
  );
}
