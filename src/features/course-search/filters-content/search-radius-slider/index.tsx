import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { FormControl, Slider, Text, View } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type SearchRadiusSliderProps = {
  control: Control<CourseFiltersFormValues>;
};

export function SearchRadiusSlider({ control }: SearchRadiusSliderProps) {
  return (
    <Controller
      name="radius"
      control={control}
      render={({ field }) => (
        <FormControl>
          <View gap={2}>
            <FormControl.Label>Alcance da busca</FormControl.Label>
            <View direction="row" gap={3}>
              <View.Item grow>
                <Slider
                  name={field.name}
                  min={0}
                  max={60}
                  step={5}
                  value={field.value}
                  onChange={({ value }) => field.onChange(value)}
                  renderValue={(args) => `${args.value}km`}
                />
              </View.Item>
              <Text variant="body-2" color="neutral">
                {field.value}km
              </Text>
            </View>
          </View>
        </FormControl>
      )}
    />
  );
}
