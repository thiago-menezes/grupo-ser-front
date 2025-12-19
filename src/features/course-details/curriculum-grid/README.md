# Grade Curricular - Documentação

## 📋 Visão Geral

Este módulo implementa a funcionalidade de grade curricular dos cursos, exibindo disciplinas organizadas por semestre e separadas em obrigatórias e optativas.

## 🗂️ Estrutura de Arquivos

```
curriculum-grid/
├── index.tsx           # Componente principal CurriculumGrid
├── types.ts            # Definições de tipos TypeScript
├── styles.module.scss  # Estilos SCSS
├── api/
│   └── query.ts       # Hook useQueryCurriculum (React Query)
└── README.md          # Esta documentação
```

## 📊 Formato de Dados da API

### CSV da API Real

A API retorna dados em formato CSV com ponto-e-vírgula (`;`) como separador. Cada linha representa uma disciplina.

#### Estrutura das Colunas

| Coluna | Nome            | Tipo   | Descrição                                        | Exemplo                        |
| ------ | --------------- | ------ | ------------------------------------------------ | ------------------------------ |
| 1      | institutionId   | string | ID da instituição                                | `1`                            |
| 2      | institutionName | string | Nome da instituição                              | `FACULDADE MAURICIO DE NASSAU` |
| 3      | courseId        | string | ID do curso                                      | `1002`                         |
| 4      | courseName      | string | Nome do curso                                    | `ADMINISTRAÇÃO`                |
| 5      | unknown1        | string | Valor desconhecido (sempre `1`)                  | `1`                            |
| 6      | unknown2        | string | Versão da matriz? (sempre `1`)                   | `1`                            |
| 7      | matrixName      | string | Nome da matriz curricular                        | `MATRIZ 1 ADMINISTRAÇÃO - EAD` |
| 8      | semester        | number | Número do semestre (0 = optativa)                | `1`, `2`, ..., `8`, `0`        |
| 9      | subjectCode     | string | Código da disciplina                             | `AD0001`                       |
| 10     | subjectName     | string | Nome da disciplina                               | `INTRODUÇÃO A EAD`             |
| 11     | subjectType     | string | Tipo: `B` (Básica/Obrigatória) ou `O` (Optativa) | `B` ou `O`                     |

#### Exemplo de Linha CSV

```csv
1;FACULDADE MAURICIO DE NASSAU;1002;ADMINISTRAÇÃO;1;1;MATRIZ 1 ADMINISTRAÇÃO - EAD;1;AD0001;INTRODUÇÃO A EAD;B
```

### Observações Importantes

1. **Semestre 0**: Disciplinas com `semester = 0` são **optativas** (eletivas)
2. **Tipo B vs O**:
   - `B` = Básica/Obrigatória (mandatory)
   - `O` = Optativa (elective)
3. **Carga Horária**: O CSV **NÃO** inclui informação de carga horária
4. **Modalidade**: Está presente no nome da matriz (ex: "MATRIZ 1 ADMINISTRAÇÃO - **EAD**")

## 🔄 Tipos TypeScript

### CurriculumSubject

```typescript
type CurriculumSubject = {
  code: string; // Código da disciplina (ex: AD0001)
  name: string; // Nome da disciplina
  type: 'B' | 'O'; // B = obrigatória, O = optativa
  workload?: number; // Carga horária (opcional, não vem do CSV)
};
```

### CurriculumSemester

```typescript
type CurriculumSemester = {
  semester: number; // 0 = optativas, 1-8 = semestres regulares
  subjects: CurriculumSubject[];
  totalWorkload?: number; // Opcional, calculado se houver workload
};
```

### CurriculumResponse

```typescript
type CurriculumResponse = {
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseName: string;
  matrixName: string; // Nome da matriz curricular
  modality: CurriculumModality; // ead | presencial | semipresencial | aovivo
  period: CurriculumPeriod | null;
  totalSemesters: number;
  totalWorkload?: number; // Opcional
  semesters: CurriculumSemester[];
  electiveSubjects: CurriculumSubject[]; // Disciplinas optativas (semestre 0)
};
```

## 🔌 API Endpoint

### Request

```
GET /api/curriculum?courseId={id}&modality={modality}&period={period}
```

#### Query Parameters

| Parâmetro | Tipo                                                  | Obrigatório | Descrição                |
| --------- | ----------------------------------------------------- | ----------- | ------------------------ |
| courseId  | string                                                | Sim         | ID do curso              |
| modality  | `ead` \| `presencial` \| `semipresencial` \| `aovivo` | Sim         | Modalidade do curso      |
| period    | `morning` \| `afternoon` \| `evening` \| `integral`   | Não         | Período/turno (opcional) |

#### Exemplo

```
GET /api/curriculum?courseId=1002&modality=ead
```

### Response

```json
{
  "institutionId": "1",
  "institutionName": "FACULDADE MAURICIO DE NASSAU",
  "courseId": "1002",
  "courseName": "ADMINISTRAÇÃO",
  "matrixName": "MATRIZ 1 ADMINISTRAÇÃO - EAD",
  "modality": "ead",
  "period": null,
  "totalSemesters": 8,
  "semesters": [
    {
      "semester": 1,
      "subjects": [
        {
          "code": "AD0001",
          "name": "INTRODUÇÃO A EAD",
          "type": "B"
        }
      ]
    }
  ],
  "electiveSubjects": [
    {
      "code": "AD0061",
      "name": "LÍNGUA BRASILEIRA DOS SINAIS - LIBRAS (OPTATIVA)",
      "type": "O"
    }
  ]
}
```

## 🎨 Uso do Componente

### Básico

```tsx
import { CurriculumGrid } from '@/features/course-details/curriculum-grid';

<CurriculumGrid courseId="1002" defaultModality="ead" />;
```

### Com período padrão

```tsx
<CurriculumGrid
  courseId="1002"
  defaultModality="presencial"
  defaultPeriod="morning"
/>
```

### Props

| Prop            | Tipo               | Obrigatório | Padrão       | Descrição                  |
| --------------- | ------------------ | ----------- | ------------ | -------------------------- |
| courseId        | string             | Sim         | -            | ID do curso                |
| defaultModality | CurriculumModality | Não         | 'presencial' | Modalidade inicial         |
| defaultPeriod   | CurriculumPeriod   | Não         | undefined    | Período inicial (opcional) |

## 🔄 Hook useQueryCurriculum

```tsx
import { useQueryCurriculum } from './api/query';

const { data, isLoading, isError, error } = useQueryCurriculum({
  courseId: '1002',
  modality: 'ead',
  period: 'morning', // opcional
});
```

### Configuração

- **Cache**: 10 minutos (`staleTime`)
- **Habilitado**: Apenas quando `courseId` e `modality` estão presentes
- **Query Key**: `['curriculum', courseId, modality, period]`

## 🚀 Integração Futura com API Real

Para integrar com a API real que retorna CSV:

1. **Atualizar o endpoint** em [app/(backend)/api/curriculum/route.ts](<../../../../../../../app/(backend)/api/curriculum/route.ts>)
2. **Implementar parser CSV**: Converter o CSV em `CurriculumResponse`
3. **Mapear modalidade**: Extrair a modalidade do `matrixName`
4. **Separar optativas**: Filtrar disciplinas com `semester = 0`

### Exemplo de Parser

```typescript
function parseCSVToCurriculum(csv: string): CurriculumResponse {
  const lines = csv.split('\n').filter((line) => line.trim());

  const subjects = lines.map((line) => {
    const [
      institutionId,
      institutionName,
      courseId,
      courseName,
      _,
      __,
      matrixName,
      semester,
      subjectCode,
      subjectName,
      subjectType,
    ] = line.split(';');

    return {
      institutionId,
      institutionName,
      courseId,
      courseName,
      matrixName,
      semester: parseInt(semester),
      subject: {
        code: subjectCode,
        name: subjectName,
        type: subjectType as 'B' | 'O',
      },
    };
  });

  // Agrupar por semestre
  const semesters: Record<number, CurriculumSubject[]> = {};
  const electives: CurriculumSubject[] = [];

  subjects.forEach(({ semester, subject }) => {
    if (semester === 0) {
      electives.push(subject);
    } else {
      if (!semesters[semester]) {
        semesters[semester] = [];
      }
      semesters[semester].push(subject);
    }
  });

  // Construir resposta final
  return {
    institutionId: subjects[0].institutionId,
    institutionName: subjects[0].institutionName,
    courseId: subjects[0].courseId,
    courseName: subjects[0].courseName,
    matrixName: subjects[0].matrixName,
    modality: extractModalityFromMatrix(subjects[0].matrixName),
    period: null,
    totalSemesters: Math.max(...Object.keys(semesters).map(Number)),
    semesters: Object.entries(semesters).map(([sem, subjs]) => ({
      semester: parseInt(sem),
      subjects: subjs,
    })),
    electiveSubjects: electives,
  };
}
```

## 📝 Notas de Desenvolvimento

- O componente atualmente exibe apenas a aba "Disciplinas Obrigatórias"
- Para implementar a aba "Disciplinas Optativas", adicione lógica de tabs
- A carga horária é opcional e pode ser ocultada se não disponível
- Os dados mockados seguem exatamente a estrutura do CSV fornecido
