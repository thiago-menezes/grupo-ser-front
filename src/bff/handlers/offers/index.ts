import { clientApiFetch, buildClientApiUrl } from '../../services/client-api';

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

export type OfferTurno = {
  ID: string;
  Nome_Turno: string;
  Periodo: string;
  FormasIngresso: FormasIngresso[];
  Hash_CursoTurno: string;
};

export type Offer = {
  ID: number;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
  Turnos: OfferTurno[];
};

export type OffersResponse = {
  data: Offer[];
};

export type OffersParams = {
  marca?: string;
  estado?: string;
  cidade?: string;
  modalidades?: string;
  turnos?: string;
  duracoes?: string;
  precoMin?: number;
  precoMax?: number;
  page?: number;
  limit?: number;
};

export async function fetchOffers(
  params: OffersParams,
): Promise<OffersResponse> {
  const url = buildClientApiUrl('/cursos/ofertas', params);
  return clientApiFetch<OffersResponse>(url);
}
