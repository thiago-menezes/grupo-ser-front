import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Checkbox, FormControl, View } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type CourseDurationCheckboxesProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CourseDurationCheckboxes({
  control,
}: CourseDurationCheckboxesProps) {
  return (
    <Controller
      name="durations"
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormControl.Label>Duração do curso</FormControl.Label>
          <View direction="row" gap={2}>
            <Checkbox
              name="duration-1-2"
              checked={field?.value?.includes('1-2')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), '1-2']);
                } else {
                  field.onChange(field?.value?.filter((d) => d !== '1-2'));
                }
              }}
            >
              1 a 2 anos
            </Checkbox>
            <Checkbox
              name="duration-2-3"
              checked={field?.value?.includes('2-3')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), '2-3']);
                } else {
                  field.onChange(field?.value?.filter((d) => d !== '2-3'));
                }
              }}
            >
              2 a 3 anos
            </Checkbox>
            <Checkbox
              name="duration-3-4"
              checked={field?.value?.includes('3-4')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), '3-4']);
                } else {
                  field.onChange(field?.value?.filter((d) => d !== '3-4'));
                }
              }}
            >
              3 a 4 anos
            </Checkbox>
            <Checkbox
              name="duration-4-plus"
              checked={field?.value?.includes('4-plus')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), '4-plus']);
                } else {
                  field.onChange(field?.value?.filter((d) => d !== '4-plus'));
                }
              }}
            >
              Mais que 4 anos
            </Checkbox>
          </View>
        </FormControl>
      )}
    />
  );
}
