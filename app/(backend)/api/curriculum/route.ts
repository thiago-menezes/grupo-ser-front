import { NextRequest, NextResponse } from 'next/server';
import type {
  CurriculumResponse,
  CurriculumModality,
  CurriculumPeriod,
} from '@/features/course-details/curriculum-grid/types';
import type { CurriculumErrorDTO } from '@/types/api/curriculum';

function getMockCurriculum(
  _courseId: string,
  modality: CurriculumModality,
  period: CurriculumPeriod | null,
): CurriculumResponse {
  return {
    institutionId: '1',
    institutionName: 'FACULDADE MAURICIO DE NASSAU',
    courseId: '1002',
    courseName: 'ADMINISTRAÇÃO',
    matrixName: 'MATRIZ 1 ADMINISTRAÇÃO - EAD',
    modality,
    period,
    totalSemesters: 8,
    semesters: [
      {
        semester: 1,
        subjects: [
          { code: 'AD0001', name: 'INTRODUÇÃO A EAD', type: 'B' },
          { code: 'AD0002', name: 'PRINCÍPIOS DE ADMINISTRAÇÃO', type: 'B' },
          { code: 'AD0003', name: 'COMUNICAÇÃO E EXPRESSÃO', type: 'B' },
          { code: 'AD0004', name: 'ECONOMIA', type: 'B' },
          { code: 'AD0005', name: 'TÓPICO INTEGRADOR I', type: 'B' },
          { code: 'AD0006', name: 'PRINCÍPIOS DE CONTABILIDADE', type: 'B' },
          { code: 'AD0007', name: 'ANÁLISE SOCIAL', type: 'B' },
        ],
      },
      {
        semester: 2,
        subjects: [
          { code: 'AD0008', name: 'TÓPICO INTEGRADOR II', type: 'B' },
          { code: 'AD0009', name: 'DIREITO EMPRESARIAL', type: 'B' },
          { code: 'AD0010', name: 'MATEMÁTICA', type: 'B' },
          { code: 'AD0011', name: 'METODOLOGIA DA CIÊNCIA', type: 'B' },
          { code: 'AD0012', name: 'TÓPICO INTEGRADOR III', type: 'B' },
          { code: 'AD0013', name: 'MATEMÁTICA FINANCEIRA', type: 'B' },
          { code: 'AD0014', name: 'TEORIA GERAL DA ADMINISTRAÇÃO', type: 'B' },
        ],
      },
      {
        semester: 3,
        subjects: [
          { code: 'AD0015', name: 'TÓPICO INTEGRADOR IV', type: 'B' },
          { code: 'AD0016', name: 'RESPONSABILIDADE SOCIAL', type: 'B' },
          { code: 'AD0017', name: 'ADMINSTRAÇÃO DE MARKETING', type: 'B' },
          { code: 'AD0018', name: 'GESTÃO DE PESSOAS', type: 'B' },
          { code: 'AD0019', name: 'TÓPICO INTEGRADOR V', type: 'B' },
          { code: 'AD0020', name: 'PLANEJAMENTO ESTRATÉGICO', type: 'B' },
          { code: 'AD0021', name: 'ORGANIZAÇÃO SISTEMAS E MÉTODOS', type: 'B' },
        ],
      },
      {
        semester: 4,
        subjects: [
          { code: 'AD0022', name: 'TÓPICO INTEGRADOR VI', type: 'B' },
          { code: 'AD0023', name: 'SISTEMA DE INFORMAÇÃO', type: 'B' },
          { code: 'AD0024', name: 'LOGÍSTICA EMPRESARIAL', type: 'B' },
          { code: 'AD0025', name: 'ADMINISTRAÇÃO DA PRODUÇÃO', type: 'B' },
          { code: 'AD0026', name: 'TÓPICO DE INTEGRADOR VII', type: 'B' },
          { code: 'AD0027', name: 'GESTÃO DA QUALIDADE', type: 'B' },
          { code: 'AD0028', name: 'ADMINISTRAÇÃO FINANCEIRA', type: 'B' },
        ],
      },
      {
        semester: 5,
        subjects: [
          { code: 'AD0029', name: 'TÓPICO INTEGRADOR VII', type: 'B' },
          { code: 'AD0030', name: 'ECONOMIA E GESTÃO', type: 'B' },
          {
            code: 'AD0031',
            name: 'MÉTODO ESTATÍSTICO PARA TOMADA DE DECISÃO',
            type: 'B',
          },
          { code: 'AD0032', name: 'ESTRATÉGIA EMPRESARIAL', type: 'B' },
          { code: 'AD0033', name: 'PSICOLOGIA ORGANIZACIONAL', type: 'B' },
        ],
      },
      {
        semester: 6,
        subjects: [
          { code: 'AD0034', name: 'TÓPICO INTEGRADOR VIII', type: 'B' },
          { code: 'AD0035', name: 'DIREITO ADMINISTRATIVO', type: 'B' },
          {
            code: 'AD0036',
            name: 'ESTRATÉGIAS DE GESTÃO DE PESSOAS',
            type: 'B',
          },
          { code: 'AD0037', name: 'ADMINISTRAÇÃO DE SERVIÇOS', type: 'B' },
          { code: 'AD0038', name: 'TÓPICO INTEGRADOR VIIII', type: 'B' },
          { code: 'AD0039', name: 'ESTRATÉGIA DE MARKETING', type: 'B' },
          {
            code: 'AD0040',
            name: 'ESTRATÉGIA DE GESTÃO DA PRODUÇÃO E OPERAÇÕES',
            type: 'B',
          },
          {
            code: 'AD0041',
            name: 'MACRO AMBIENTE E CENÁRIOS ECONÔMICOS',
            type: 'B',
          },
          { code: 'AD0042', name: 'CONTABILIDADE GERENCIAL', type: 'B' },
        ],
      },
      {
        semester: 7,
        subjects: [
          { code: 'AD0043', name: 'TÓPICO INTEGRADOR IX', type: 'B' },
          { code: 'AD0044', name: 'MARKETING DE SERVIÇOS', type: 'B' },
          {
            code: 'AD0045',
            name: 'TÓPICOS AVANÇADOS EM ADMINISTRAÇÃO',
            type: 'B',
          },
          { code: 'AD0046', name: 'ECONOMIA BRASILEIRA', type: 'B' },
          { code: 'AD0047', name: 'TÓPICOS INTEGRADOR X', type: 'B' },
          { code: 'AD0048', name: 'CONTROLADORIA', type: 'B' },
          { code: 'AD0049', name: 'NEGÓCIOS INTERNACIONAIS', type: 'B' },
          { code: 'AD0050', name: 'EMPREENDEDORISMO', type: 'B' },
          { code: 'AD0051', name: 'COMUNICAÇÃO EMPRESARIAL', type: 'B' },
        ],
      },
      {
        semester: 8,
        subjects: [
          { code: 'AD0052', name: 'TÓPICO INTEGRADOR XI', type: 'B' },
          { code: 'AD0053', name: 'GESTÃO DE PROJETOS', type: 'B' },
          { code: 'AD0054', name: 'CONSULTORIA EMPRESARIAL', type: 'B' },
          { code: 'AD0055', name: 'AUDITORIA', type: 'B' },
          { code: 'AD0056', name: 'JOGOS EMPRESARIAIS', type: 'B' },
          { code: 'AD0057', name: 'PESQUISA EM ADMINISTRAÇÃO', type: 'B' },
          { code: 'AD0058', name: 'COMPORTAMENTO DO CONSUMIDOR', type: 'B' },
          { code: 'AD0059', name: 'ADMINISTRAÇÃO PÚBLICA', type: 'B' },
          { code: 'AD0060', name: 'PROJETO FINAL I', type: 'B' },
        ],
      },
    ],
    electiveSubjects: [
      {
        code: 'AD0061',
        name: 'LÍNGUA BRASILEIRA DOS SINAIS - LIBRAS (OPTATIVA)',
        type: 'O',
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const courseId = searchParams.get('courseId');
  const modality = searchParams.get('modality') as CurriculumModality;
  const period = searchParams.get('period') as CurriculumPeriod | null;

  // Validação dos parâmetros
  if (!courseId) {
    return NextResponse.json<CurriculumErrorDTO>(
      { error: 'courseId é obrigatório' },
      { status: 400 },
    );
  }

  if (!modality) {
    return NextResponse.json<CurriculumErrorDTO>(
      { error: 'modality é obrigatório' },
      { status: 400 },
    );
  }

  // Validar valores de modality
  const validModalities: CurriculumModality[] = [
    'ead',
    'presencial',
    'semipresencial',
    'aovivo',
  ];
  if (!validModalities.includes(modality)) {
    return NextResponse.json<CurriculumErrorDTO>(
      {
        error: `modality deve ser um dos seguintes valores: ${validModalities.join(', ')}`,
      },
      { status: 400 },
    );
  }

  // Validar valores de period (se fornecido)
  const validPeriods: CurriculumPeriod[] = [
    'morning',
    'afternoon',
    'evening',
    'integral',
  ];
  if (period && !validPeriods.includes(period)) {
    return NextResponse.json<CurriculumErrorDTO>(
      {
        error: `period deve ser um dos seguintes valores: ${validPeriods.join(', ')}`,
      },
      { status: 400 },
    );
  }

  // Try to fetch from real backend API
  const backendUrl = process.env.BACKEND_CURRICULUM_API_URL;

  if (backendUrl) {
    try {
      const queryParams = new URLSearchParams({
        courseId,
        modality,
        ...(period && { period }),
      });

      const response = await fetch(`${backendUrl}?${queryParams.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 600 }, // Cache for 10 minutes
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json<CurriculumResponse>(data);
      }

      // If not 404, log the error but continue to mock
      if (response.status !== 404) {
        console.warn(
          `Backend curriculum API returned ${response.status}, falling back to mock`,
        );
      }
    } catch (error) {
      console.warn('Backend curriculum API unavailable, using mock:', error);
    }
  }

  // Fallback to mock data
  const mockResponse = getMockCurriculum(courseId, modality, period);
  return NextResponse.json<CurriculumResponse>(mockResponse);
}
