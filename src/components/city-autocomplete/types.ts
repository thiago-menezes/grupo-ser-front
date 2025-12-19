export type CityAutocompleteProps = {
  /** Current city value (can be technical format "city:name-state:code" or simple name) */
  value?: string;
  /** Callback when city is selected */
  onChange: (cityValue: string) => void;
  /** Label for the form control */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show geolocation option */
  showGeolocation?: boolean;
  /** Geolocation permission denied state */
  permissionDenied?: boolean;
  /** Callback to request geolocation permission */
  onRequestPermission?: () => void;
  /** Name attribute for the input */
  name?: string;
};
