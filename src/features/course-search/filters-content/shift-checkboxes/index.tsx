import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Checkbox, FormControl, View } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type ShiftCheckboxesProps = {
  control: Control<CourseFiltersFormValues>;
};

export function ShiftCheckboxes({ control }: ShiftCheckboxesProps) {
  return (
    <Controller
      name="shifts"
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormControl.Label>Turno</FormControl.Label>
          <View direction="row" gap={2}>
            <Checkbox
              name="shift-morning"
              checked={field?.value?.includes('morning')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'morning']);
                } else {
                  field.onChange(field?.value?.filter((s) => s !== 'morning'));
                }
              }}
            >
              Manhã
            </Checkbox>
            <Checkbox
              name="shift-afternoon"
              checked={field?.value?.includes('afternoon')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'afternoon']);
                } else {
                  field.onChange(
                    field?.value?.filter((s) => s !== 'afternoon'),
                  );
                }
              }}
            >
              Tarde
            </Checkbox>
            <Checkbox
              name="shift-night"
              checked={field?.value?.includes('night')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'night']);
                } else {
                  field.onChange(field?.value?.filter((s) => s !== 'night'));
                }
              }}
            >
              Noite
            </Checkbox>
            <Checkbox
              name="shift-fulltime"
              checked={field?.value?.includes('fulltime')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'fulltime']);
                } else {
                  field.onChange(field?.value?.filter((s) => s !== 'fulltime'));
                }
              }}
            >
              Integral
            </Checkbox>
            <Checkbox
              name="shift-virtual"
              checked={field?.value?.includes('virtual')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'virtual']);
                } else {
                  field.onChange(field?.value?.filter((s) => s !== 'virtual'));
                }
              }}
            >
              Virtual
            </Checkbox>
          </View>
        </FormControl>
      )}
    />
  );
}
