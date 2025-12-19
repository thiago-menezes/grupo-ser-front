import { Text, View } from 'reshaped';
import styles from './styles.module.scss';
import type { CourseAdmissionFormsProps } from './types';

export function CourseAdmissionForms({
  availableForms,
  selectedFormId,
  onSelectForm,
}: CourseAdmissionFormsProps) {
  const dynamicForms =
    availableForms &&
    Array.isArray(availableForms) &&
    availableForms.length > 0 &&
    'code' in availableForms[0]
      ? availableForms
      : undefined;

  if (dynamicForms) {
    return (
      <View className={styles.forms}>
        <Text
          as="h2"
          variant="featured-2"
          weight="medium"
          className={styles.label}
        >
          Selecione sua forma de ingresso:
        </Text>

        <View className={styles.formsGrid}>
          {dynamicForms.map((form) => {
            const isSelected = selectedFormId === form.code;
            return (
              <button
                key={form.id}
                type="button"
                className={`${styles.formCard} ${isSelected ? styles.selected : ''}`}
                aria-label={`${form.name}`}
                aria-pressed={isSelected}
                onClick={() => onSelectForm(form.code)}
              >
                <View className={styles.formContent}>
                  <Text
                    as="h3"
                    variant="body-2"
                    weight="bold"
                    className={styles.formTitle}
                  >
                    {form.name}
                  </Text>
                </View>
              </button>
            );
          })}
        </View>
      </View>
    );
  }
}
