'use client';

import { useState } from 'react';
import { View, Text, Button, Tabs } from 'reshaped';
import { useQueryCurriculum } from './api/query';
import styles from './styles.module.scss';
import type { CurriculumModality, CurriculumPeriod } from './types';

export type CurriculumGridProps = {
  courseId: string;
  defaultModality?: CurriculumModality;
  defaultPeriod?: CurriculumPeriod;
};

type TabValue = 'mandatory' | 'elective';

export function CurriculumGrid({
  courseId,
  defaultModality = 'presencial',
  defaultPeriod,
}: CurriculumGridProps) {
  const [selectedModality, setSelectedModality] =
    useState<CurriculumModality>(defaultModality);
  const [selectedPeriod] = useState<CurriculumPeriod | undefined>(
    defaultPeriod,
  );
  const [selectedTab, setSelectedTab] = useState<TabValue>('mandatory');

  const { data } = useQueryCurriculum({
    courseId,
    modality: selectedModality,
    period: selectedPeriod,
  });

  const mandatorySubjects =
    data?.semesters.flatMap((semester) =>
      semester.subjects.filter((subject) => subject.type === 'B'),
    ) ?? [];
  const electiveSubjects = data?.electiveSubjects ?? [];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View>
          <Text variant="featured-2" weight="bold">
            Grade curricular
          </Text>

          <Text variant="body-3" color="neutral-faded">
            Aqui você está no controle, explore as matérias que encontrará em
            sua graduação
          </Text>
        </View>

        <View className={styles.filters}>
          <View className={styles.filterGroup} gap={2}>
            <Text variant="caption-1" weight="medium">
              Modalidades de ensino
            </Text>

            <View className={styles.buttonGroup}>
              <Button
                variant={
                  selectedModality === 'presencial' ? 'outline' : 'ghost'
                }
                onClick={() => setSelectedModality('presencial')}
              >
                Presencial
              </Button>
              <Button
                variant={
                  selectedModality === 'semipresencial' ? 'outline' : 'ghost'
                }
                onClick={() => setSelectedModality('semipresencial')}
              >
                Semipresencial
              </Button>
              <Button
                variant={selectedModality === 'ead' ? 'outline' : 'ghost'}
                onClick={() => setSelectedModality('ead')}
              >
                Digital(EAD)
              </Button>
              <Button
                variant={selectedModality === 'aovivo' ? 'outline' : 'ghost'}
                onClick={() => setSelectedModality('aovivo')}
              >
                Ao vivo
              </Button>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs para disciplinas obrigatórias e optativas */}
      <View className={styles.tabs}>
        <Tabs
          value={selectedTab}
          onChange={(tab) => {
            if (tab.value === 'mandatory' || tab.value === 'elective') {
              setSelectedTab(tab.value);
            }
          }}
        >
          <Tabs.List>
            <Tabs.Item value="mandatory">Disciplinas Obrigatórias</Tabs.Item>
            <Tabs.Item value="elective">Disciplinas Optativas</Tabs.Item>
          </Tabs.List>

          <Tabs.Panel value="mandatory" className={styles.tabContent}>
            <View className={styles.disciplineCount}>
              <Text variant="body-2" weight="medium">
                {mandatorySubjects.length} disciplinas
              </Text>
            </View>

            <View className={styles.semestersList}>
              {data?.semesters.map((semester) => {
                const semesterMandatory = semester.subjects.filter(
                  (s) => s.type === 'B',
                );
                if (semesterMandatory.length === 0) return null;

                return (
                  <View
                    key={semester.semester}
                    className={styles.semesterSection}
                  >
                    <View className={styles.semesterHeader}>
                      <Text variant="body-2" weight="bold">
                        {semester.semester}º Semestre
                      </Text>
                      <Text variant="caption-1" color="neutral-faded">
                        {semesterMandatory.length} disciplinas
                      </Text>
                    </View>
                    <View className={styles.subjectsList}>
                      {semesterMandatory.map((subject) => (
                        <View key={subject.code} className={styles.subjectCard}>
                          <Text variant="body-3" weight="medium">
                            {subject.name}
                          </Text>
                          {subject.workload && (
                            <Text variant="caption-1" color="neutral-faded">
                              {subject.workload} horas
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </Tabs.Panel>

          <Tabs.Panel value="elective" className={styles.tabContent}>
            <View className={styles.disciplineCount}>
              <Text variant="body-2" weight="medium">
                {electiveSubjects.length} disciplinas
              </Text>
            </View>

            <View className={styles.subjectsList}>
              {electiveSubjects.map((subject) => (
                <View key={subject.code} className={styles.subjectCard}>
                  <Text
                    variant="caption-1"
                    color="neutral-faded"
                    weight="medium"
                  >
                    Optativa
                  </Text>
                  <Text variant="body-3" weight="medium">
                    {subject.name}
                  </Text>
                  {subject.workload && (
                    <Text variant="caption-1" color="neutral-faded">
                      {subject.workload} horas
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </Tabs.Panel>
        </Tabs>
      </View>

      {/* Informações resumidas */}
      <View className={styles.summary}>
        <View className={styles.summaryItem}>
          <Text variant="caption-1" color="neutral-faded">
            Total de semestres
          </Text>
          <Text variant="body-2" weight="bold">
            {data?.totalSemesters ?? '-'}
          </Text>
        </View>
        <View className={styles.summaryItem}>
          <Text variant="caption-1" color="neutral-faded">
            Carga horária total
          </Text>

          <Text variant="body-2" weight="bold">
            {data?.totalWorkload ? `${data.totalWorkload}h` : '-'}
          </Text>
        </View>
        <View className={styles.summaryItem}>
          <Text variant="caption-1" color="neutral-faded">
            Disciplinas obrigatórias
          </Text>

          <Text variant="body-2" weight="bold">
            {mandatorySubjects.length}
          </Text>
        </View>
        <View className={styles.summaryItem}>
          <Text variant="caption-1" color="neutral-faded">
            Disciplinas optativas
          </Text>
          <Text variant="body-2" weight="bold">
            {electiveSubjects.length}
          </Text>
        </View>
      </View>
    </View>
  );
}
