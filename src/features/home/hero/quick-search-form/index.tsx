import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Button,
  Autocomplete,
  TextField,
  Checkbox,
  FormControl,
} from 'reshaped';
import type { AutocompleteProps } from 'reshaped';
import { Icon } from '@/components';
import { useCityContext } from '@/contexts/city';
import {
  useGeolocation,
  useInstitutionData,
  useCitiesAutocomplete,
  type CityOption,
} from '@/hooks';
import { useQuickSearchForm } from '../hooks';
import { buildSearchParams, formatCityValue } from '../utils';
import styles from './styles.module.scss';
import type { CourseLevel, QuickSearchFormProps } from './types';

export function QuickSearchForm({
  institutionSlug,
  onSubmit,
}: QuickSearchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseLevel>('graduation');
  const [inputValue, setInputValue] = useState('');
  const isUserTypingRef = useRef(false);
  const previousCityRef = useRef<string>('');
  const isGeolocationRequestRef = useRef(false);
  const { city, setCity, course, setCourse, modalities, toggleModality } =
    useQuickSearchForm();
  const [formattedCityValue, setFormattedCityValue] = useState('');
  const {
    city: contextCity,
    state: contextState,
    source: citySource,
    setCityState,
    setFocusCityFieldCallback,
  } = useCityContext();
  // Get institution data for default city/state
  const {
    defaultCity,
    defaultState,
    isLoading: isInstitutionLoading,
  } = useInstitutionData();

  // Skip geolocation for returning users with saved preferences
  // Only request geolocation if no city exists in context (localStorage)
  const skipGeolocation = contextCity !== '' && contextState !== '';

  // Don't pass manualCity/manualState to geolocation hook
  // This allows geolocation to work independently and update the city
  const {
    city: geolocationCity,
    state: geolocationState,
    permissionDenied,
    requestPermission,
    isLoading: isGeoLoading,
  } = useGeolocation({
    institutionDefaultCity: defaultCity,
    institutionDefaultState: defaultState,
    skip: skipGeolocation, // Skip if user has saved preference
  });

  // Initialize with institution default or Recife if no city is set on mount
  useEffect(() => {
    // Only set default on mount if geolocation hasn't started yet and institution data is loaded
    // This provides immediate feedback while geolocation is loading
    if (
      !contextCity &&
      !contextState &&
      inputValue === '' &&
      !isInstitutionLoading
    ) {
      const defaultCityToUse = defaultCity || 'Recife';
      const defaultStateToUse = defaultState || 'PE';
      setCityState(defaultCityToUse, defaultStateToUse, 'default');
      setInputValue(`${defaultCityToUse} - ${defaultStateToUse}`);
      setFormattedCityValue(
        formatCityValue(defaultCityToUse, defaultStateToUse),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCity, defaultState, isInstitutionLoading]); // Run when institution data loads

  // Register focus callback with context
  useEffect(() => {
    setFocusCityFieldCallback(() => {
      // Find the city input field by name attribute
      const cityInput =
        document.querySelector<HTMLInputElement>('input[name="city"]');
      cityInput?.focus();
    });
  }, [setFocusCityFieldCallback]);

  // Set city based on priority: default → geolocation → manual
  useEffect(() => {
    // Priority 1: Manual selection - never override manual selection
    if (citySource === 'manual') {
      return;
    }

    // Priority 2: Geolocation (if authorized and available)
    if (
      geolocationCity &&
      geolocationState &&
      !isGeoLoading &&
      !permissionDenied
    ) {
      setCityState(geolocationCity, geolocationState, 'geolocation');
      setInputValue(`${geolocationCity} - ${geolocationState}`);
      setFormattedCityValue(formatCityValue(geolocationCity, geolocationState));
      return;
    }

    // Priority 3: Institution default (if no city and geolocation not available)
    if (!contextCity && !isGeoLoading && !isInstitutionLoading) {
      const defaultCityToUse = defaultCity || 'Recife';
      const defaultStateToUse = defaultState || 'PE';
      setCityState(defaultCityToUse, defaultStateToUse, 'default');
      setInputValue(`${defaultCityToUse} - ${defaultStateToUse}`);
      setFormattedCityValue(
        formatCityValue(defaultCityToUse, defaultStateToUse),
      );
    }
  }, [
    contextCity,
    contextState,
    citySource,
    isGeoLoading,
    geolocationCity,
    geolocationState,
    permissionDenied,
    defaultCity,
    defaultState,
    isInstitutionLoading,
    setCityState,
  ]);

  // Use dynamic city search
  const { cities: searchResults, isLoading: isSearching } =
    useCitiesAutocomplete(inputValue);

  // Build all available options - only show geolocation button if permission denied
  const allOptions = useMemo(() => {
    const options: CityOption[] = [];

    // Add geolocation option as first item if permission denied
    if (permissionDenied) {
      options.push({
        label: 'Permitir localização',
        value: 'geolocation:request',
        city: '',
        state: '',
      });
    }

    // Add search results from API (don't add geolocation city to options)
    options.push(...searchResults);

    return options;
  }, [permissionDenied, searchResults]);

  // Get current city display label (e.g., "Recife - PE")
  const currentCityLabel = useMemo(() => {
    if (contextCity && contextState) {
      // Format city name properly: capitalize each word
      const formattedCity = contextCity
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
      return `${formattedCity} - ${contextState.toUpperCase()}`;
    }
    return '';
  }, [contextCity, contextState]);

  // Sync input value with selected city only when city changes externally (not from user typing)
  useEffect(() => {
    const currentCityKey =
      contextCity && contextState ? `${contextCity}-${contextState}` : '';

    // Only update if city changed externally (not from user typing)
    if (
      currentCityKey !== previousCityRef.current &&
      !isUserTypingRef.current
    ) {
      if (contextCity && contextState) {
        // Use the properly formatted city label
        setInputValue(currentCityLabel);
        // Always update formatted value when city changes
        setFormattedCityValue(formatCityValue(contextCity, contextState));
      } else {
        // If no city is set, ensure we show institution default or Recife as default
        // This prevents empty field
        if (!inputValue && !isGeoLoading && !isInstitutionLoading) {
          const defaultCityToUse = defaultCity || 'Recife';
          const defaultStateToUse = defaultState || 'PE';
          setInputValue(`${defaultCityToUse} - ${defaultStateToUse}`);
          setFormattedCityValue(
            formatCityValue(defaultCityToUse, defaultStateToUse),
          );
        }
      }
      previousCityRef.current = currentCityKey;
    }

    // Reset typing flag after a short delay
    if (isUserTypingRef.current) {
      const timer = setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contextCity,
    contextState,
    currentCityLabel,
    inputValue,
    formattedCityValue,
    isGeoLoading,
  ]);

  const handleInputChange: AutocompleteProps['onChange'] = ({ value }) => {
    // Prevent geolocation text from appearing in input
    if (isGeolocationRequestRef.current && value === 'Permitir localização') {
      setInputValue('');
      return;
    }

    isUserTypingRef.current = true;
    setInputValue(value || '');
    // Clear selection if user is typing something different
    if (value !== currentCityLabel) {
      setCity('');
      setFormattedCityValue('');
      // Clear context city when user types something different
      if (contextCity && contextState) {
        setCityState('', '');
      }
    }
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
        requestPermission();
        // Clear input value to prevent "Permitir localização" from appearing
        setTimeout(() => {
          setInputValue('');
          isGeolocationRequestRef.current = false;
        }, 0);
        return;
      }

      // Set city and state from selected option (manual selection)
      isUserTypingRef.current = false;
      setCityState(option.city, option.state, 'manual');
      // Store formatted value for form submission (don't overwrite contextCity)
      setFormattedCityValue(option.value);
      // Use the label (value from Autocomplete.Item) for display
      setInputValue(value || option.label);
      previousCityRef.current = `${option.city}-${option.state}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const searchData = {
        city: formattedCityValue || city,
        course,
        modalities,
        courseLevel: activeTab,
      };

      if (onSubmit) {
        onSubmit(searchData);
      }

      const params = buildSearchParams(searchData);
      router.push(`/${institutionSlug}/cursos?${params.toString()}`);
    } catch {
      // Silently handle form submission errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.tabsContainer}>
        <Button
          size="small"
          variant={activeTab === 'graduation' ? 'solid' : 'ghost'}
          color={activeTab === 'graduation' ? 'primary' : undefined}
          onClick={() => setActiveTab('graduation')}
          disabled={isLoading}
          icon={<Icon name="school" />}
        >
          Graduação
        </Button>

        <Button
          size="small"
          variant={activeTab === 'postgraduate' ? 'solid' : 'ghost'}
          color={activeTab === 'postgraduate' ? 'primary' : undefined}
          onClick={() => setActiveTab('postgraduate')}
          disabled={isLoading}
          icon={<Icon name="briefcase" />}
          className={
            activeTab === 'postgraduate' ? styles.secondaryButton : undefined
          }
        >
          Pós-Graduação
        </Button>
      </div>

      <div className={styles.inputsContainer}>
        <FormControl disabled={isLoading}>
          <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
          <Autocomplete
            name="city"
            placeholder="Encontre sua cidade"
            value={inputValue}
            onChange={handleInputChange}
            onItemSelect={handleItemSelect}
            disabled={isLoading}
            size="large"
          >
            {isSearching && inputValue.trim().length >= 2 && (
              <Autocomplete.Item value="" data={null} disabled>
                Buscando...
              </Autocomplete.Item>
            )}
            {allOptions.map((option) => {
              // Always show geolocation option
              if (option.value === 'geolocation:request') {
                return (
                  <Autocomplete.Item
                    key={option.value}
                    value={option.label}
                    data={option}
                  >
                    <div className={styles.geolocationOption}>
                      <Icon name="current-location" size={16} />
                      <span>{option.label}</span>
                    </div>
                  </Autocomplete.Item>
                );
              }

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

        <FormControl disabled={isLoading}>
          <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
          <TextField
            name="course"
            placeholder="Encontre seu curso"
            value={course}
            onChange={({ value }) => setCourse(value)}
            disabled={isLoading}
            size="large"
          />
        </FormControl>

        <Button
          type="submit"
          size="large"
          color="primary"
          disabled={isLoading}
          aria-label="Search courses"
          className={
            activeTab === 'postgraduate' ? styles.secondaryButton : undefined
          }
          endIcon={<Icon name="search" />}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      <div className={styles.filtersContainer}>
        <span className={styles.filtersLabel}>Modalidade:</span>
        <div className={styles.filterOptions}>
          {['Presencial', 'Semi', 'EAD'].map((modality) => {
            const modalityKey = modality.toLowerCase() as
              | 'presencial'
              | 'semi'
              | 'ead';
            return (
              <Checkbox
                key={modality}
                name={`modality-${modality}`}
                checked={modalities.includes(modalityKey)}
                onChange={() => toggleModality(modalityKey)}
                disabled={isLoading}
                className={
                  activeTab === 'postgraduate'
                    ? styles.secondaryCheckbox
                    : undefined
                }
              >
                {modality === 'Semi' ? 'Semi' : modality}
              </Checkbox>
            );
          })}
        </div>
      </div>
    </form>
  );
}

export type { QuickSearchFormProps };
