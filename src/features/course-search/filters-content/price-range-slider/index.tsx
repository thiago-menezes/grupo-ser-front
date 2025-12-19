import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { FormControl, Slider, Text, View } from 'reshaped';
import { formatPrice } from '@/packages/utils';
import type { CourseFiltersFormValues } from '../../types';
import styles from './styles.module.scss';

export type PriceRangeSliderProps = {
  control: Control<CourseFiltersFormValues>;
};

export function PriceRangeSlider({ control }: PriceRangeSliderProps) {
  return (
    <Controller
      name="priceRange"
      control={control}
      render={({ field }) => (
        <FormControl>
          <View gap={2}>
            <FormControl.Label>Preço da mensalidade</FormControl.Label>
            <Slider
              name={field.name}
              range
              min={100}
              max={4500}
              step={50}
              minValue={field?.value?.min || 0}
              maxValue={field?.value?.max || 0}
              onChange={(args) => {
                if (
                  'minValue' in args &&
                  'maxValue' in args &&
                  args.minValue !== undefined &&
                  args.maxValue !== undefined
                ) {
                  field.onChange({
                    min: args.minValue,
                    max: args.maxValue,
                  });
                }
              }}
              renderValue={(args) => {
                if (
                  'minValue' in args &&
                  'maxValue' in args &&
                  typeof args.minValue === 'number' &&
                  typeof args.maxValue === 'number'
                ) {
                  return `${formatPrice(args.minValue)} a ${formatPrice(args.maxValue)}`;
                }
                if (
                  args.value !== undefined &&
                  args.value !== null &&
                  typeof args.value === 'number'
                ) {
                  return formatPrice(args.value);
                }
                return '';
              }}
            />
            <View
              direction="row"
              justify="space-between"
              className={styles.priceRangeLabels}
            >
              <Text variant="body-2" color="neutral">
                {formatPrice(field?.value?.min || 0)}
              </Text>
              <Text variant="body-2" color="neutral">
                {formatPrice(field?.value?.max || 0)}
              </Text>
            </View>
          </View>
        </FormControl>
      )}
    />
  );
}
