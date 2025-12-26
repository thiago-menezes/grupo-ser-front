import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { CourseInput } from '@/components';
import type { CourseFiltersFormValues } from '../../types';

export type CourseNameInputProps = {
  control: Control<CourseFiltersFormValues>;
  onSubmit?: () => void;
};

export function CourseNameInput({ control, onSubmit }: CourseNameInputProps) {
  return (
    <Controller
      name="courseName"
      control={control}
      render={({ field }) => (
        <CourseInput
          value={field.value || ''}
          onChange={field.onChange}
          name={field.name}
          onSubmit={onSubmit}
        />
      )}
    />
  );
}
