import type { CourseCard } from 'types/api/courses-search';
import type { Offer } from '../handlers/offers';

function normalizeModality(modality: string): string {
  const lower = modality.toLowerCase();
  if (lower.includes('presencial') && !lower.includes('semi'))
    return 'presencial';
  if (lower.includes('semi')) return 'semipresencial';
  if (lower.includes('ead') || lower.includes('distância')) return 'ead';
  return modality;
}

function extractMinPrice(offer: Offer): number {
  let minPrice = Infinity;

  for (const turno of offer.Turnos || []) {
    for (const forma of turno.FormasIngresso || []) {
      for (const tipo of forma.TiposPagamento || []) {
        for (const valor of tipo.ValoresPagamento || []) {
          const price = parseFloat(valor.Mensalidade || valor.Valor);
          if (!isNaN(price) && price < minPrice) {
            minPrice = price;
          }
        }
        if (tipo.Mensalidade) {
          const price = parseFloat(tipo.Mensalidade);
          if (!isNaN(price) && price < minPrice) {
            minPrice = price;
          }
        }
      }
    }
  }

  return minPrice === Infinity ? 0 : minPrice;
}

function extractShifts(offer: Offer): string[] {
  const shifts = new Set<string>();
  for (const turno of offer.Turnos || []) {
    if (turno.Nome_Turno) {
      shifts.add(turno.Nome_Turno);
    }
  }
  return Array.from(shifts);
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} meses`;
  if (remainingMonths === 0) return `${years} anos`;
  return `${years} anos e ${remainingMonths} meses`;
}

function extractLevel(courseName: string): string {
  const upper = courseName.toUpperCase();
  if (upper.startsWith('BACHARELADO')) return 'Bacharelado';
  if (upper.startsWith('LICENCIATURA')) return 'Licenciatura';
  if (upper.startsWith('TECNOLOGIA') || upper.startsWith('TECNÓLOGO'))
    return 'Tecnólogo';
  return 'Graduação';
}

export function transformOfferToCard(
  offer: Offer,
  brand: string = '',
  city: string = '',
  state: string = '',
): CourseCard {
  const minPrice = extractMinPrice(offer);
  const shifts = extractShifts(offer);
  const modality = normalizeModality(offer.Modalidade);

  return {
    courseId: offer.ID.toString(),
    courseName: offer.Nome_Curso,
    level: extractLevel(offer.Nome_Curso),
    modalities: [modality],
    shifts,
    durationMonths: offer.Periodo,
    durationText: formatDuration(offer.Periodo),
    precoMin: minPrice,
    priceText: minPrice > 0 ? `R$ ${minPrice.toFixed(2)}` : 'A consultar',
    campus: '',
    city,
    state,
    brand,
  };
}

export function transformOffersToCards(
  offers: Offer[],
  brand: string = '',
  city: string = '',
  state: string = '',
): CourseCard[] {
  return offers.map((offer) => transformOfferToCard(offer, brand, city, state));
}
