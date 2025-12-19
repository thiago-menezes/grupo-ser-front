import { useState } from 'react';
import { View } from 'reshaped';
import { EmptyState } from '@/components';
import { ActiveFilters } from './active-filters';
import { CourseFiltersProvider } from './context';
import { CourseGrid } from './course-grid';
import { useCourseGrid } from './course-grid/hooks';
import { FiltersButton } from './filters-button';
import { FiltersContent } from './filters-content';
import { FiltersModal } from './filters-modal';
import { CourseSearchHeader } from './header';
import { ResultsHeader } from './results-header';
import { CourseSearchBar } from './search-bar';
import styles from './styles.module.scss';

function CourseSearchPageContent() {
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const { courses, isLoading } = useCourseGrid();

  return (
    <View className={styles.page}>
      <View className={styles.container}>
        <CourseSearchHeader />
        <CourseSearchBar />
        <FiltersButton onClick={() => setIsFiltersModalOpen(true)} />
        <ActiveFilters variant="mobile" />

        <View className={styles.mainContent}>
          <View className={styles.filtersSidebar}>
            <FiltersContent />
          </View>

          <View className={styles.coursesGridContainer}>
            <ResultsHeader />
            {!isLoading && courses.length === 0 && (
              <EmptyState
                icon="search"
                title="Nenhum curso encontrado"
                description="Busque por outra cidade para visualizar os cursos disponíveis."
              />
            )}
            <CourseGrid />
          </View>
        </View>
      </View>

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
      />
    </View>
  );
}

export function CourseSearchPage() {
  return (
    <CourseFiltersProvider>
      <CourseSearchPageContent />
    </CourseFiltersProvider>
  );
}
