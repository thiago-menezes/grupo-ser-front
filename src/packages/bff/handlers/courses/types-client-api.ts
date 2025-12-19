/**
 * Client API types for course details
 * Maps to the external course details API payload
 */

export type OfertaEntrada = {
  mesInicio: number;
  mesFim: number;
  Tipo: 'Percentual' | 'Valor';
  Valor: string;
};

export type ValoresPagamento = {
  ID: number;
  Valor: string;
  TemplateCampanha: string;
  OfertaEntrada: OfertaEntrada[];
  PrecoBase: string;
  Mensalidade: string;
  InicioVigencia: string;
  FimVigencia: string;
  PrioridadeAbrangencia: number;
};

export type TiposPagamento = {
  ID: number;
  Nome_TipoPagamento: string;
  Codigo: string;
  LinkCheckout: string;
  ValoresPagamento: ValoresPagamento[];
  PrecoBase?: string;
  Mensalidade?: string;
};

export type FormasIngresso = {
  ID: number;
  Nome_FormaIngresso: string;
  Codigo: string;
  TiposPagamento: TiposPagamento[];
};

export type Turnos = {
  ID: number;
  Nome_Turno: string;
  Periodo: string;
  FormasIngresso: FormasIngresso[];
  Hash_CursoTurno?: string;
};

export type CourseDetailsClientAPI = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
  Turnos: Turnos[];
};
