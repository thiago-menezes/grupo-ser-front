import { useState } from 'react';
import { Tabs, View } from 'reshaped';
import { Icon, RichTextRenderer } from '@/components';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseCoordinationProps = {
  course: CourseDetails;
};

export function CourseCoordination({ course }: CourseCoordinationProps) {
  const [activeTab, setActiveTab] = useState<'pedagogical'>('pedagogical');

  const pedagogicalProject = course.pedagogicalProject;

  if (!pedagogicalProject) {
    return null;
  }

  return (
    <View className={styles.coordination}>
      <Tabs
        onChange={(args) => setActiveTab(args.value as 'pedagogical')}
        variant="borderless"
        defaultValue="pedagogical"
      >
        <Tabs.List>
          <Tabs.Item value="pedagogical" icon={<Icon name="book" />}>
            Projeto pedagógico
          </Tabs.Item>
        </Tabs.List>
      </Tabs>

      <View className={styles.tabContent}>
        {activeTab === 'pedagogical' && (
          <View className={styles.pedagogicalContent}>
            <RichTextRenderer content={pedagogicalProject} />
          </View>
        )}
      </View>
    </View>
  );
}
