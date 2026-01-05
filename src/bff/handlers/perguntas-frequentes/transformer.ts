import type { StrapiPerguntaFrequente, FaqDTO } from './types';

export function transformFaq(strapi: StrapiPerguntaFrequente): FaqDTO {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    question: strapi.pergunta,
    answer: strapi.resposta,
  };
}
