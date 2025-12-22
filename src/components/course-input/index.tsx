'use client';

import { FormControl, TextField } from 'reshaped';

export type CourseInputProps = {
  /** Current course value */
  value: string;
  /** Callback when course changes */
  onChange: (value: string) => void;
  /** Callback when form should be submitted (e.g., on Enter key) */
  onSubmit?: () => void;
  /** Label for the form control */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Name attribute for the input */
  name?: string;
};

export function CourseInput({
  value,
  onChange,
  onSubmit,
  label = 'Qual curso quer estudar?',
  placeholder = 'Encontre seu curso',
  disabled = false,
  size = 'medium',
  name = 'course',
}: CourseInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormControl disabled={disabled}>
      <FormControl.Label>{label}</FormControl.Label>
      <TextField
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={({ value }) => onChange(value || '')}
        disabled={disabled}
        size={size}
        inputAttributes={{
          onKeyDown: handleKeyDown,
        }}
      />
    </FormControl>
  );
}
