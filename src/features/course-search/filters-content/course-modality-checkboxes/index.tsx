import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Checkbox, FormControl, View } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type CourseModalityCheckboxesProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CourseModalityCheckboxes({
  control,
}: CourseModalityCheckboxesProps) {
  return (
    <Controller
      name="modalities"
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormControl.Label>Modalidade do curso</FormControl.Label>
          <View gap={2}>
            <Checkbox
              name="modality-Presencial"
              checked={field?.value?.includes('presencial')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'presencial']);
                } else {
                  field.onChange(
                    field?.value?.filter((m) => m !== 'presencial'),
                  );
                }
              }}
            >
              Presencial
            </Checkbox>
            <Checkbox
              name="modality-SemiPresencial"
              checked={field?.value?.includes('semipresencial')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'semipresencial']);
                } else {
                  field.onChange(
                    field?.value?.filter((m) => m !== 'semipresencial'),
                  );
                }
              }}
            >
              Semipresencial
            </Checkbox>
            <Checkbox
              name="modality-Distancia"
              checked={field?.value?.includes('ead')}
              onChange={({ checked }) => {
                if (checked) {
                  field.onChange([...(field?.value || []), 'ead']);
                } else {
                  field.onChange(field?.value?.filter((m) => m !== 'ead'));
                }
              }}
            >
              A distância EAD
            </Checkbox>
          </View>
        </FormControl>
      )}
    />
  );
}
