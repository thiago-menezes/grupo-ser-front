import { fetchCoursesSearch, extractCourseId } from './api';

export type CourseAutocompleteParams = {
  marca?: string;
  estado?: string;
  cidade?: string;
  modalidade?: string;
};

export type CourseAutocompleteResult = {
  id: string;
  label: string;
  value: string;
  modalidade: string;
  periodo: string;
};

export type CoursesAutocompleteResponse = {
  results: CourseAutocompleteResult[];
};

export async function handleCoursesAutocomplete(
  params: CourseAutocompleteParams,
): Promise<CoursesAutocompleteResponse> {
  const courses = await fetchCoursesSearch({
    marca: params.marca,
    estado: params.estado,
    cidade: params.cidade,
    modalidade: params.modalidade,
  });

  return {
    results: courses.data.map((course) => ({
      id: course.ID,
      label: course.Nome_Curso,
      value: extractCourseId(course.ID),
      modalidade: course.Modalidade,
      periodo: course.Periodo,
    })),
  };
}
