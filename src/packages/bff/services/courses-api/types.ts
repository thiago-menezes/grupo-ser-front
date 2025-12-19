export type CourseAPIRaw = {
  Marca_ID: string;
  Marca_Nome: string;
  Unidade_ID: string;
  Unidade_Nome: string;
  Estado: string;
  Cidade: string;
  Curso_ID: string;
  Curso_Nome: string;
  Modalidade: string;
  Nivel_Ensino: string;
  Turno_ID: string;
  Turno_Nome: string;
  Hash_CursoTurno: string;
  Periodo: number;
  FormaIngresso_ID: string;
  FormaIngresso_Nome: string;
  FormaIngresso_Codigo: string;
  TipoPagamento_ID: string;
  TipoPagamento_Nome: string;
  TipoPagamento_Codigo: string;
  URL_Checkout: string;
  ValorPagamento_ID: string;
  Valor: number;
  InicioVigencia: string;
  FimVigencia: string;
  PrioridadeAbrangencia: number;
};

export type CoursesAPIResponse = {
  cursos: CourseAPIRaw[];
  total: number;
};

export type JSONServerQueryParams = {
  Curso_ID?: string;
  Nivel_Ensino?: string;
  Cidade?: string;
  Estado?: string;
  Modalidade?: string;
  Curso_Nome_like?: string;
  Turno_Nome?: string;
  Valor_gte?: number;
  Valor_lte?: number;
};
