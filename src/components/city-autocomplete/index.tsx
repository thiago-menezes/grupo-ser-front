'use client';

import { useState, useRef, useEffect, useMemo, startTransition } from 'react';
import { FormControl, Autocomplete } from 'reshaped';
import type { AutocompleteProps } from 'reshaped';
import { useCitiesAutocomplete, type CityOption } from '@/hooks';
import { formatCityDisplayValue } from '@/utils/city-formatting';
import { Icon } from '../icon';
import { CityAutocompleteProps } from './types';

export function CityAutocomplete({
  value = '',
  onChange,
  label = 'Em que cidade quer estudar?',
  placeholder = 'Encontre sua cidade',
  disabled = false,
  size = 'medium',
  showGeolocation = false,
  permissionDenied = false,
  onRequestPermission,
  name = 'city',
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const isUserTypingRef = useRef(false);
  const isGeolocationRequestRef = useRef(false);

  // Use dynamic city search
  const { cities: searchResults, isLoading: isSearching } =
    useCitiesAutocomplete(inputValue);

  // Format display value from field value
  const currentDisplayValue = useMemo(
    () => formatCityDisplayValue(value || ''),
    [value],
  );

  // Sync inputValue with currentDisplayValue when value changes externally
  useEffect(() => {
    if (!isUserTypingRef.current && currentDisplayValue) {
      startTransition(() => {
        setInputValue(currentDisplayValue);
      });
    }
  }, [currentDisplayValue]);

  // Build all available options including geolocation
  const allOptions = useMemo(() => {
    const options: CityOption[] = [];

    // Add geolocation option as first item if enabled and permission denied
    if (showGeolocation && permissionDenied) {
      options.push({
        label: 'Permitir localização',
        value: 'geolocation:request',
        city: '',
        state: '',
      });
    }

    // Add search results from API
    options.push(...searchResults);

    return options;
  }, [showGeolocation, permissionDenied, searchResults]);

  const handleInputChange: AutocompleteProps['onChange'] = ({ value }) => {
    // Prevent geolocation text from appearing in input
    if (isGeolocationRequestRef.current && value === 'Permitir localização') {
      setInputValue('');
      return;
    }

    isUserTypingRef.current = true;
    setInputValue(value || '');

    // Clear selection if user is typing something different
    if (value !== currentDisplayValue) {
      onChange('');
    }

    // Reset typing flag after delay
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 100);
  };

  const handleItemSelect: AutocompleteProps['onItemSelect'] = ({
    value,
    data,
  }) => {
    if (data) {
      const option = data as CityOption;

      // Handle geolocation request
      if (option.value === 'geolocation:request') {
        isGeolocationRequestRef.current = true;
        onRequestPermission?.();
        // Clear input value to prevent "Permitir localização" from appearing
        setTimeout(() => {
          setInputValue('');
          isGeolocationRequestRef.current = false;
        }, 0);
        return;
      }

      // Set city from selected option
      isUserTypingRef.current = false;
      onChange(option.value);
      // Use the label (value from Autocomplete.Item) for display
      setInputValue(value || option.label);
    }
  };

  return (
    <FormControl disabled={disabled}>
      <FormControl.Label>{label}</FormControl.Label>
      <Autocomplete
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onItemSelect={handleItemSelect}
        disabled={disabled}
        size={size}
      >
        {isSearching && inputValue.trim().length >= 2 && (
          <Autocomplete.Item value="" data={null} disabled>
            Buscando...
          </Autocomplete.Item>
        )}
        {allOptions.map((option) => {
          // Show geolocation option with icon
          if (option.value === 'geolocation:request') {
            return (
              <Autocomplete.Item
                key={option.value}
                value={option.label}
                data={option}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="current-location" size={16} />
                  <span>{option.label}</span>
                </div>
              </Autocomplete.Item>
            );
          }

          // Show all other options
          return (
            <Autocomplete.Item
              key={option.value}
              value={option.label}
              data={option}
            >
              {option.label}
            </Autocomplete.Item>
          );
        })}
      </Autocomplete>
    </FormControl>
  );
}
