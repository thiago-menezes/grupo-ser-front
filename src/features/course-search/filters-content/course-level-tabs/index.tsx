import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Tabs } from 'reshaped';
import { Icon } from '@/components';
import type { CourseFiltersFormValues } from '../../types';

export type CourseLevelTabsProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CourseLevelTabs({ control }: CourseLevelTabsProps) {
  return (
    <Controller
      name="courseLevel"
      control={control}
      render={({ field }) => (
        <Tabs
          variant="pills-elevated"
          value={field.value}
          onChange={({ value }) => field.onChange(value)}
        >
          <Tabs.List>
            <Tabs.Item value="graduation" icon={<Icon name="school" />}>
              Graduação
            </Tabs.Item>

            <Tabs.Item value="postgraduate" icon={<Icon name="briefcase" />}>
              Pós-Graduação
            </Tabs.Item>
          </Tabs.List>
        </Tabs>
      )}
    />
  );
}
