// ============================================
// TIPOS DA GRADE CURRICULAR (baseado no CSV real da API)
// ============================================

/**
 * Tipo da disciplina
 * - B (Básica) = Obrigatória
 * - O (Optativa) = Eletiva
 */
export type CurriculumSubjectType = 'B' | 'O';

/**
 * Disciplina da grade curricular
 */
export type CurriculumSubject = {
  code: string; // código da disciplina (ex: AD0001)
  name: string; // nome da disciplina
  type: CurriculumSubjectType; // B = obrigatória, O = optativa
  workload?: number; // carga horária em horas (opcional, não vem do CSV)
};

/**
 * Semestre da grade curricular
 * Nota: Semestre 0 indica disciplinas optativas
 */
export type CurriculumSemester = {
  semester: number; // 0 = optativas, 1-8 = semestres regulares
  subjects: CurriculumSubject[];
  totalWorkload?: number; // opcional, calculado se houver workload
};

export type CurriculumModality =
  | 'ead'
  | 'presencial'
  | 'semipresencial'
  | 'aovivo';

export type CurriculumPeriod = 'morning' | 'afternoon' | 'evening' | 'integral';

/**
 * Resposta completa da grade curricular
 */
export type CurriculumResponse = {
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseName: string;
  matrixName: string; // nome da matriz (ex: MATRIZ 1 ADMINISTRAÇÃO - EAD)
  modality: CurriculumModality;
  period: CurriculumPeriod | null;
  totalSemesters: number;
  totalWorkload?: number; // opcional, calculado se houver workload
  semesters: CurriculumSemester[];
  electiveSubjects: CurriculumSubject[]; // disciplinas optativas (semestre 0)
};

/**
 * Parâmetros de consulta da grade curricular
 */
export type CurriculumQueryParams = {
  courseId: string;
  modality: CurriculumModality;
  period?: CurriculumPeriod;
};

/**
 * Formato de linha do CSV da API
 */
export type CurriculumCSVRow = {
  institutionId: string; // coluna 1
  institutionName: string; // coluna 2
  courseId: string; // coluna 3
  courseName: string; // coluna 4
  unknown1: string; // coluna 5 (sempre 1)
  unknown2: string; // coluna 6 (sempre 1, versão da matriz?)
  matrixName: string; // coluna 7
  semester: number; // coluna 8 (0 = optativa)
  subjectCode: string; // coluna 9
  subjectName: string; // coluna 10
  subjectType: CurriculumSubjectType; // coluna 11 (B ou O)
};
