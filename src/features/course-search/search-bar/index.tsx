import { startTransition, useCallback, useEffect, useState } from 'react';
import { Button, FormControl, Grid, TextField } from 'reshaped';
import { Icon } from '@/components';
import { useCourseFiltersContext } from '../context';
import styles from './styles.module.scss';

export function CourseSearchBar() {
  const { filters, applyFilters } = useCourseFiltersContext();
  const [courseName, setCourseName] = useState(filters.courseName);

  useEffect(() => {
    if (courseName !== filters.courseName) {
      startTransition(() => {
        setCourseName(filters.courseName);
      });
    }
  }, [filters.courseName, courseName]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      applyFilters({
        ...filters,
        courseName: courseName.trim(),
      });
    },
    [filters, applyFilters, courseName],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        columns={'1fr auto'}
        gap={2}
        align="end"
        maxWidth="400px"
        className={styles.searchBar}
      >
        <FormControl>
          <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
          <TextField
            name="course"
            placeholder="Exemplo: Java"
            size="medium"
            value={courseName}
            onChange={({ value }) => setCourseName(value || '')}
          />
        </FormControl>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="medium"
          icon={<Icon name="search" />}
        >
          Buscar
        </Button>
      </Grid>
    </form>
  );
}
